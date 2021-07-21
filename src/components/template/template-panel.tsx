import React from 'react';
import './template-panel.scss';

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
import { ITemplate } from '../../model/template';
import { ITemplateService, TemplateServiceId } from "../../services/template";
import { Observer } from 'azure-devops-ui/Observer';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { IStack, StackValues } from '../../model/stacks';
import { TagPicker } from "azure-devops-ui/TagPicker";
import { ISuggestionItemProps } from "azure-devops-ui/SuggestionsList";
import { PillGroup } from 'azure-devops-ui/PillGroup';
import { Pill, PillSize } from 'azure-devops-ui/Pill';
import { Icon } from 'azure-devops-ui/Icon';
import { Location } from "azure-devops-ui/Utilities/Position";


export interface ITemplatePanelProps {
  show: boolean;
  onDismiss: any;
}

interface ITemplatePanelState {
  showAuthentication: boolean;
  currentTemplate?: ITemplate;
  template: ITemplate[];
  tagSuggestions: IStack[]
}

class TemplatePanel extends React.Component<ITemplatePanelProps, ITemplatePanelState>  {

  selection = new ListSelection(true);

  service = Services.getService<ITemplateService>(
    TemplateServiceId
  );

  constructor(props: ITemplatePanelProps) {
    super(props);

    this.state = {
      showAuthentication: false,
      currentTemplate: this.getStartValue(),
      tagSuggestions: StackValues,
      template: [],
    };

    this.service.getTemplate().then(items => {
      this.setState({
        template: items.sortByProp("text")
      });
    });
  }

  getStartValue(): ITemplate {
    return {
      id: "",
      replaceKey: "",
      text: "",
      description: "",
      gitUrl: "",
      user: "",
      pass: "",
      tags: []
    };
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.state.currentTemplate[prop] = value;

    this.setState({
      currentTemplate: that.state.currentTemplate
    });
  }

  isValid(): boolean {
    const { currentTemplate, showAuthentication } = this.state;

    return (
      !!currentTemplate.text        && currentTemplate.text.trim() !== "" &&
      !!currentTemplate.description && currentTemplate.description.trim() !== "" &&
      !!currentTemplate.gitUrl      && currentTemplate.gitUrl.trim() !== "" &&
      !!currentTemplate.replaceKey  && currentTemplate.replaceKey.trim() !== "" &&
      !!currentTemplate.tags        && currentTemplate.tags.length > 0 &&
      (!showAuthentication ||
        currentTemplate.pass && currentTemplate.pass.trim() !== ""
      )
    );
  }

  render() {

    const { showAuthentication, currentTemplate, template, tagSuggestions } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={this.props.onDismiss}
          titleProps={{ text: "Template catalog" }}
          description={
            "Base repository configuration for template generation."
          }
          footerButtonProps={[
            { text: "Close", onClick: this.props.onDismiss }
          ]}>

          <div className="template--content">
            <div className="template--group">
              <label className="template--group-label">
                Template *
              </label>
              <TextField
                inputId="text"
                value={currentTemplate.text}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                placeholder="Name your template"
              />
            </div>
            <div className="template--group">
              <TextField
                inputId="description"
                value={currentTemplate.description}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                required={true}
                multiline={true}
                rows={4}
                placeholder="Template description"
              />
            </div>
            <div className="template--group">
              <label className="template--group-label">
                Source repository *
              </label>
              <TextField
                inputId="gitUrl"
                value={currentTemplate.gitUrl}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                required={true}
                placeholder="e.g. https://github.com/Microsoft/vscode.git"
              />
            </div>
            <div className="template--group">
              <label className="template--group-label">
                Replace key *    <Icon ariaLabel="Replace key info" iconName="Info"
                  tooltipProps={{
                    anchorOffset: { horizontal: 8, vertical: 8 },
                    fixedLayout: false,
                    showOnFocus: true,
                    text:
                      "This tooltip is designed to overflow to the bottom right",
                    tooltipOrigin: {
                      horizontal: Location.start,
                      vertical: Location.start
                    }
                  }} />
              </label>
              <TextField
                inputId="replaceKey"
                value={currentTemplate.replaceKey}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                required={true}
                placeholder=""
              />
            </div>
            <div className="template--group">
              <label className="template--group-label">
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
                        currentTemplate.tags.findIndex(d => d.id === item.id) === -1
                      ).filter(
                        testItem => testItem.text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
                      )
                    this.setState({ tagSuggestions: items });
                  }}
                  onTagAdded={(tag: IStack) => {
                    currentTemplate.tags.push(tag);
                    this.setState({
                      currentTemplate: currentTemplate, tagSuggestions: StackValues.filter(item =>
                        currentTemplate.tags.findIndex(d => d.id === item.id) === -1
                      )
                    });
                  }}
                  onTagRemoved={(tag: IStack) => {
                    var items = currentTemplate.tags.filter(x => x.id !== tag.id)
                    currentTemplate.tags = items;
                    this.setState({
                      currentTemplate: currentTemplate, tagSuggestions: StackValues.filter(item =>
                        items.findIndex(d => d.id === item.id) === -1
                      )
                    });
                  }}
                  renderSuggestionItem={(tag: ISuggestionItemProps<IStack>) => {
                    return <div className="body-m">{tag.item.text}</div>;
                  }}
                  selectedTags={currentTemplate.tags}
                  suggestions={tagSuggestions}
                  suggestionsLoading={false}
                />
              </div>
            </div>
            <div className="template--group">
              <Toggle
                text={"Requires authentication"}
                checked={showAuthentication}
                onChange={(event, value) => {
                  currentTemplate.user = "";
                  currentTemplate.pass = "";
                  this.setState({
                    showAuthentication: value,
                    currentTemplate: currentTemplate
                  });
                }}
              />
            </div>
            {showAuthentication && <>
              <div className="template--group">
                <TextField
                  inputId="user"
                  value={currentTemplate.user}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  placeholder="Username"
                />
              </div>
              <div className="template--group">
                <TextField
                  inputId="pass"
                  value={currentTemplate.pass}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  inputType={"password"}
                  required={true}
                  placeholder="Password / PAT *"
                />
              </div>
            </>}

            <div className="template--group template--add-button">
              {!currentTemplate.id &&
                <Button
                  text="Add"
                  primary={true}
                  disabled={!this.isValid()}
                  onClick={() => {
                    currentTemplate.id = Guid.create().toString();
                    template.push(currentTemplate);
                    this.service.saveTemplate(currentTemplate);
                    this.setState({
                      showAuthentication: false,
                      currentTemplate: this.getStartValue(),
                      template: this.state.template.sortByProp("text"),
                      tagSuggestions: StackValues
                    })
                  }} />
              }
              {currentTemplate.id &&
                <ButtonGroup className="template--add-button">
                  <Button
                    text="Cancel"
                    subtle={true}
                    onClick={() => {
                      this.selection.clear()
                      this.setState({
                        showAuthentication: false,
                        currentTemplate: this.getStartValue(),
                        tagSuggestions: StackValues
                      })
                    }} />
                  <Button
                    text="Delete"
                    danger={true}
                    onClick={() => {
                      this.selection.clear();
                      let items = template.filter(d => d.id !== currentTemplate.id);
                      this.service.removeTemplate(currentTemplate.id);
                      this.setState({
                        showAuthentication: false,
                        currentTemplate: this.getStartValue(),
                        template: items.sortByProp("text"),
                        tagSuggestions: StackValues
                      })
                    }} />
                  <Button
                    text="Save"
                    primary={true}
                    disabled={!this.isValid()}
                    onClick={() => {
                      this.selection.clear();
                      let items = template.filter(d => d.id !== currentTemplate.id);
                      this.service.saveTemplate(currentTemplate);
                      items.push(currentTemplate);
                      if (items.length > 0) {
                        this.setState({
                          showAuthentication: false,
                          currentTemplate: this.getStartValue(),
                          template: items.sortByProp("text"),
                          tagSuggestions: StackValues
                        })
                      }
                    }} />
                </ButtonGroup>
              }
            </div>

            {template && template.length > 0 &&
              <Card>
                <div style={{ display: "flex" }}>

                  <Observer itemProvider={new ObservableValue<ArrayItemProvider<ITemplate>>(new ArrayItemProvider(template))}>
                    {(observableProps: { itemProvider: ArrayItemProvider<ITemplate> }) => (
                      <ScrollableList
                        width="100%"
                        itemProvider={observableProps.itemProvider}
                        renderRow={this.renderRow}
                        selection={this.selection}
                        onSelect={(event: React.SyntheticEvent<HTMLElement>, listRow: IListRow<ITemplate>) => {
                          var items = StackValues.filter(item =>
                            listRow.data.tags.findIndex(d => d.id === item.id) === -1
                          )
                          this.setState({
                            showAuthentication: listRow.data.pass !== "",
                            currentTemplate: listRow.data.deepCopy(),
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
    item: ITemplate,
    details: IListItemDetails<ITemplate>,
    key?: string
  ): JSX.Element => {
    return (
      <ListItem key={key || "list-item" + index} index={index} details={details}>
        <div className="template--list-row flex-row h-scroll-hidden">
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden">
            <span className="text-ellipsis">{item.text}</span>
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

export default TemplatePanel;