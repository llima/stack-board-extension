import React from 'react';
import './settings-panel.scss';

import {
  ScrollableList,
  IListItemDetails,
  ListSelection,
  ListItem,
  IListRow
} from "azure-devops-ui/List";

import { Guid } from "guid-typescript";
import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Card } from 'azure-devops-ui/Card';
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import { Toggle } from "azure-devops-ui/Toggle";
import { Button } from "azure-devops-ui/Button";

import { Services } from "../../services/services";
import { ISettings } from '../../model/settings';
import { ISettingsService, SettingsServiceId } from "../../services/settings";
import { Observer } from 'azure-devops-ui/Observer';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { IStack, StackValues } from '../../model/stacks';
import { TagPicker } from "azure-devops-ui/TagPicker";
import { ISuggestionItemProps } from "azure-devops-ui/SuggestionsList";
import { PillGroup } from 'azure-devops-ui/PillGroup';
import { Pill, PillSize } from 'azure-devops-ui/Pill';

export interface ISettingsPanelProps {
  show: boolean;
  onDismiss: any;
}

interface ISettingsPanelState {
  showAuthentication: boolean;
  currentSettings?: ISettings;
  settings: ISettings[];
  tagSuggestions: IStack[]
}

class SettingsPanel extends React.Component<ISettingsPanelProps, ISettingsPanelState>  {

  selection = new ListSelection(true);

  service = Services.getService<ISettingsService>(
    SettingsServiceId
  );

  constructor(props: ISettingsPanelProps) {
    super(props);

    this.state = {
      showAuthentication: false,
      currentSettings: this.getStartValue(),
      tagSuggestions: StackValues,
      settings: [],
    };

    this.service.getSettings().then(items => {
      this.setState({
        settings: items.sortByProp("name")
      });
    });
  }

  getStartValue(): ISettings {
    return {
      id: "",
      name: "",
      description: "",
      gitUrl: "",
      user: "",
      pass: "",
      tags: []
    };
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.state.currentSettings[prop] = value;

    this.setState({
      currentSettings: that.state.currentSettings
    });
  }

  isValid(): boolean {
    const { currentSettings, showAuthentication } = this.state;

    return (
      !!currentSettings.name && currentSettings.name.trim() !== "" &&
      !!currentSettings.description && currentSettings.description.trim() !== "" &&
      !!currentSettings.gitUrl && currentSettings.gitUrl.trim() !== "" &&
      (!showAuthentication ||
        currentSettings.pass && currentSettings.pass.trim() !== ""
      )
    );
  }

  render() {

    const { showAuthentication, currentSettings } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={this.props.onDismiss}
          titleProps={{ text: "Source settings" }}
          description={
            "Base repository configuration for template generation."
          }
          footerButtonProps={[
            { text: "Close", onClick: this.props.onDismiss }
          ]}>

          <div className="settings--content">
            <div className="settings--group">
              <label className="settings--group-label">
                Template *
              </label>
              <TextField
                inputId="name"
                value={currentSettings.name}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                placeholder="Name your template"
              />
            </div>
            <div className="settings--group">
              <TextField
                inputId="description"
                value={currentSettings.description}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                required={true}
                multiline={true}
                rows={4}
                placeholder="Template description"
              />
            </div>
            <div className="settings--group">
              <label className="settings--group-label">
                Repository *
              </label>
              <TextField
                inputId="gitUrl"
                value={currentSettings.gitUrl}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                required={true}
                placeholder="e.g. https://github.com/Microsoft/vscode.git"
              />
            </div>
            <div className="settings--group">
              <label className="settings--group-label">
                Tags *
              </label>
              <div className="flex-column">
                <TagPicker
                  noResultsFoundText={"No results found"}
                  areTagsEqual={(a: IStack, b: IStack) => {
                    return a.id === b.id;
                  }}
                  convertItemToPill={(tag: IStack) => {
                    return {
                      content: tag.text
                    };
                  }}
                  onSearchChanged={(searchValue: string) => {
                    var items =
                      StackValues.filter(item =>
                        this.state.currentSettings.tags.findIndex(d => d.id === item.id) === -1
                      ).filter(
                        testItem => testItem.text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                      )
                    this.setState({ tagSuggestions: items });
                  }}
                  onTagAdded={(tag: IStack) => {
                    this.state.currentSettings.tags.push(tag);
                    this.setState({
                      currentSettings: this.state.currentSettings, tagSuggestions: StackValues.filter(item =>
                        this.state.currentSettings.tags.findIndex(d => d.id === item.id) === -1
                      )
                    });
                  }}
                  onTagRemoved={(tag: IStack) => {
                    var items = this.state.currentSettings.tags.filter(x => x.id !== tag.id)
                    this.state.currentSettings.tags = items;
                    this.setState({
                      currentSettings: this.state.currentSettings, tagSuggestions: StackValues.filter(item =>
                        items.findIndex(d => d.id === item.id) === -1
                      )
                    });
                  }}
                  renderSuggestionItem={(tag: ISuggestionItemProps<IStack>) => {
                    return <div className="body-m">{tag.item.text}</div>;
                  }}
                  selectedTags={this.state.currentSettings.tags}
                  suggestions={this.state.tagSuggestions}
                  suggestionsLoading={false}
                />
              </div>
            </div>
            <div className="settings--group">
              <Toggle
                text={"Requires authentication"}
                checked={showAuthentication}
                onChange={(event, value) => {
                  this.state.currentSettings.user = "";
                  this.state.currentSettings.pass = "";
                  this.setState({
                    showAuthentication: value,
                    currentSettings: this.state.currentSettings
                  });
                }}
              />
            </div>
            {this.state.showAuthentication && <>
              <div className="settings--group">
                <TextField
                  inputId="user"
                  value={currentSettings.user}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  placeholder="Username"
                />
              </div>
              <div className="settings--group">
                <TextField
                  inputId="pass"
                  value={currentSettings.pass}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  inputType={"password"}
                  required={true}
                  placeholder="Password / PAT *"
                />
              </div>
            </>}

            <div className="settings--group settings--add-button">
              {!this.state.currentSettings.id &&
                <Button
                  text="Add"
                  primary={true}
                  disabled={!this.isValid()}
                  onClick={() => {
                    this.state.currentSettings.id = Guid.create().toString();
                    this.state.settings.push(this.state.currentSettings);
                    this.service.saveSettings(this.state.currentSettings);
                    this.setState({
                      showAuthentication: false,
                      currentSettings: this.getStartValue(),
                      settings: this.state.settings.sortByProp("name"),
                      tagSuggestions: StackValues
                    })
                  }} />
              }
              {this.state.currentSettings.id &&
                <ButtonGroup className="settings--add-button">
                  <Button
                    text="Cancel"
                    subtle={true}
                    onClick={() => {
                      this.selection.clear()
                      this.setState({
                        showAuthentication: false,
                        currentSettings: this.getStartValue(),
                        tagSuggestions: StackValues
                      })
                    }} />
                  <Button
                    text="Delete"
                    danger={true}
                    onClick={() => {
                      this.selection.clear();
                      let items = this.state.settings.filter(d => d.id !== this.state.currentSettings.id);
                      this.service.removeSettings(this.state.currentSettings.id);
                      this.setState({
                        showAuthentication: false,
                        currentSettings: this.getStartValue(),
                        settings: items.sortByProp("name"),
                        tagSuggestions: StackValues
                      })
                    }} />
                  <Button
                    text="Save"
                    primary={true}
                    disabled={!this.isValid()}
                    onClick={() => {
                      this.selection.clear();
                      let items = this.state.settings.filter(d => d.id !== this.state.currentSettings.id);
                      this.service.saveSettings(this.state.currentSettings);
                      items.push(this.state.currentSettings);
                      if (items.length > 0) {
                        this.setState({
                          showAuthentication: false,
                          currentSettings: this.getStartValue(),
                          settings: items.sortByProp("name"),
                          tagSuggestions: StackValues
                        })
                      }
                    }} />
                </ButtonGroup>
              }
            </div>

            {this.state.settings && this.state.settings.length > 0 &&
              <Card>
                <div style={{ display: "flex" }}>

                  <Observer itemProvider={new ObservableValue<ArrayItemProvider<ISettings>>(new ArrayItemProvider(this.state.settings))}>
                    {(observableProps: { itemProvider: ArrayItemProvider<ISettings> }) => (
                      <ScrollableList
                        width="100%"
                        itemProvider={observableProps.itemProvider}
                        renderRow={this.renderRow}
                        selection={this.selection}
                        onSelect={(event: React.SyntheticEvent<HTMLElement>, listRow: IListRow<ISettings>) => {
                          var items = StackValues.filter(item =>
                            listRow.data.tags.findIndex(d => d.id === item.id) === -1
                          )
                          this.setState({
                            showAuthentication: listRow.data.pass !== "",
                            currentSettings: listRow.data.deepCopy(),
                            tagSuggestions: items
                          });
                        }}
                      />
                    )}
                  </Observer>

                </div>
              </Card>
            }
          </div>

        </Panel>
      );
    }
    return null;
  }

  renderRow = (
    index: number,
    item: ISettings,
    details: IListItemDetails<ISettings>,
    key?: string
  ): JSX.Element => {
    return (
      <ListItem key={key || "list-item" + index} index={index} details={details}>
        <div className="settings--list-row flex-row h-scroll-hidden">
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden">
            <span className="text-ellipsis">{item.name}</span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.description}
            </span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.gitUrl}
            </span>
            <PillGroup className="flex-row">
              {item.tags.map(tag => (
                <Pill size={PillSize.compact}>{tag.text}</Pill>
              ))}
            </PillGroup>
          </div>
        </div>
      </ListItem>
    );
  };

}

export default SettingsPanel;