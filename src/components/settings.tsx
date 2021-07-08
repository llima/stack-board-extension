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
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";


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
}

export const tasks: ITaskItem[] = [
  {
    description: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "API (.NET)"
  },
  {
    description: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "React JS"
  },
  {
    description: "https://developer.microsoft.com/en-us/azure-devops/components/list",
    iconName: "Code",
    name: "Application"
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

          <div className="create-panel--content">
            <div className="create-panel--group">
              <TextField
                label="Name *"
                required={true}
                placeholder="Name your project"
              />
            </div>
            <div className="create-panel--group">
              <TextField
                label="Repository *"
                required={true}
                placeholder="e.g. https://github.com/Microsoft/vscode.git"
              />
            </div>
            <div className="create-panel--group">
              <Toggle
                offText={"Requires authentication"}
                onText={"Requires authentication"}
                checked={showAuthentication}
                onChange={(event, value) => (this.setState({ showAuthentication: value }))}
              />
            </div>
            {this.state.showAuthentication && <>
              <div className="create-panel--group">
                <TextField
                  required={true}
                  placeholder="Username *"
                />
              </div>
              <div className="create-panel--group">
                <TextField
                  inputType={"password"}
                  required={true}
                  placeholder="Password / PAT *"
                />
              </div>
            </>}

            <div className="create-panel--group create-panel--add-button">
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
        <div className="list-example-row flex-row h-scroll-hidden">
          <Icon iconName={item.iconName} size={IconSize.medium} />
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden"
          >
            <span className="text-ellipsis">{item.name}</span>
            <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
              {item.description}
            </span>
          </div>
        </div>
      </ListItem>
    );
  };
}



export default Settings;
