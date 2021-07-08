import React from 'react';
import './settings.scss';

import {
  ScrollableList,
  IListItemDetails,
  ListSelection,
  ListItem
} from "azure-devops-ui/List";

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Card } from 'azure-devops-ui/Card';
import { Icon, IconSize } from "azure-devops-ui/Icon";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import { Toggle } from "azure-devops-ui/Toggle";
import { Button } from "azure-devops-ui/Button";

export interface ISettingsProps {
  show: boolean;
  onDismiss: any;
}

interface ISettingsState {
  showAuthentication: boolean;
}

export interface ITaskItem {
  description: string;
  iconName: string;
  name: string;
  url: string;
}

export const tasks: ITaskItem[] = [
  {
    url: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "ASP.NET Microservice",
    description: "Create a microservice with this template built by members of the community"
  },
  {
    url: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "SSR Template",
    description: "Create a website powered with Next.js"
  },
  {
    url: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "React App Template",
    description: "create a new CRA website project"
  }
];

class Settings extends React.Component<ISettingsProps, ISettingsState>  {

  selection = new ListSelection(true);
  tasks = new ArrayItemProvider(tasks);

  constructor(props: ISettingsProps) {
    super(props);
    this.state = {
      showAuthentication: false
    };
  }

  render() {

    const { showAuthentication } = this.state;


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
                required={true}
                placeholder="Name your template"
              />
            </div>
            <div className="settings--group">
              <TextField
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
                  required={true}
                  placeholder="Username *"
                />
              </div>
              <div className="settings--group">
                <TextField
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
                onClick={() => alert("Primary button clicked!")}
              />
            </div>

            <Card>
              <div style={{ display: "flex" }}>
                <ScrollableList
                  itemProvider={this.tasks}
                  renderRow={this.renderRow}
                  selection={this.selection}
                  width="100%"
                />
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
    item: ITaskItem,
    details: IListItemDetails<ITaskItem>,
    key?: string
  ): JSX.Element => {
    return (
      <ListItem key={key || "list-item" + index} index={index} details={details}>
        <div className="settings--list-row flex-row h-scroll-hidden">
          <Icon iconName={item.iconName} size={IconSize.medium} />
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden"
          >
            <span className="text-ellipsis">{item.name}</span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.description}
            </span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.url}
            </span>
          </div>
        </div>
      </ListItem>
    );
  };
}



export default Settings;
