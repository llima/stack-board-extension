import React from 'react';
import './settings.scss';

import {
  ScrollableList,
  IListItemDetails,
  ListSelection,
  ListItem
} from "azure-devops-ui/List";

import { Guid } from "guid-typescript";
import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Card } from 'azure-devops-ui/Card';
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import { Toggle } from "azure-devops-ui/Toggle";
import { Button } from "azure-devops-ui/Button";

import { Services } from "../services/services";
import { ISettings } from '../model/settings';
import { ISettingsService, SettingsServiceId } from "../services/settings";
import { Observer } from 'azure-devops-ui/Observer';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';

export interface ISettingsPanelProps {
  show: boolean;
  onDismiss: any;
}

interface ISettingsPanelState {
  showAuthentication: boolean;
  currentSettings?: ISettings;
  settings: ISettings[]
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
      settings: []
    };

  }

  getStartValue(): ISettings {
    return {
      id: Guid.create().toString(),
      name: "",
      description: "",
      gitUrl: "",
      user: "",
      pass: ""
    };
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.state.currentSettings[prop] = value;

    this.setState({
      currentSettings: that.state.currentSettings
    });
  }

  saveSettings(that: this) {
    that.service.saveSettings(that.state.currentSettings).then(item => {
      that.service.getSettings().then(items => {
        console.log(items);
        that.setState({
          currentSettings: this.getStartValue(),
          settings: items
        })
      });
    });
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
            { text: "Cancel", onClick: this.props.onDismiss },
            { text: "Save", primary: true }
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
              <Toggle
                offText={"Requires authentication"}
                onText={"Requires authentication"}
                checked={showAuthentication}
                onChange={(event, value) => (this.setState({ showAuthentication: value }))}
              />
            </div>
            {this.state.showAuthentication && <>
              <div className="settings--group">
                <TextField
                  inputId="user"
                  value={currentSettings.user}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  placeholder="Username *"
                />
              </div>
              <div className="settings--group">
                <TextField
                  inputId="user"
                  value={currentSettings.pass}
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                  inputType={"password"}
                  required={true}
                  placeholder="Password / PAT *"
                />
              </div>
            </>}

            <div className="settings--group settings--add-button">
              <Button
                text="Add"
                primary={true}
                onClick={() => {
                  this.saveSettings(this);
                }}
              />
            </div>

            <Card>
              <div style={{ display: "flex" }}>

                <Observer itemProvider={new ObservableValue<ArrayItemProvider<ISettings>>(
                  new ArrayItemProvider(this.state.settings)
                )}>
                  {(observableProps: { itemProvider: ArrayItemProvider<ISettings> }) => (
                    <ScrollableList
                      itemProvider={observableProps.itemProvider}
                      renderRow={this.renderRow}
                      selection={this.selection}
                      width="100%"
                    />                  )}
                </Observer>

              </div>
            </Card>
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
            className="flex-column h-scroll-hidden"
          >
            <span className="text-ellipsis">{item.name}</span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.description}
            </span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.gitUrl}
            </span>
          </div>
        </div>
      </ListItem>
    );
  };

}

export default SettingsPanel;