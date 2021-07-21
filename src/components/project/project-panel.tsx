import React from 'react';
import './project-panel.scss';

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Dropdown } from "azure-devops-ui/Dropdown";

import { CreateRepositoryAsync } from '../../services/repository';
import { CreateBuildDefinitionAsync } from '../../services/build';
import { ITemplate } from '../../model/template';
import { IProject } from '../../model/project';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { Guid } from 'guid-typescript';
import { Services } from '../../services/services';
import { IProjectService, ProjectServiceId } from '../../services/project';
import { IBuildOptions } from '../../model/buildOptions';

export interface IProjectPanelProps {
  show: boolean;
  onDismiss: any;
  template: ITemplate[];
}

interface IProjectPanelState {
  currentProject: IProject;
}

class ProjectPanel extends React.Component<IProjectPanelProps, IProjectPanelState>  {

  service = Services.getService<IProjectService>(
    ProjectServiceId
  );

  constructor(props: IProjectPanelProps) {
    super(props);
    this.state = {
      currentProject: {
        id        : "",
        name      : "",
        repoName  : "",
        status    : "running",
      }
    };
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.state.currentProject[prop] = value;
    this.setState({
      currentProject: that.state.currentProject
    });
  }

  isValid(): boolean {
    const { currentProject } = this.state;

    return (
      !!currentProject.name     && currentProject.name.trim()         !== "" &&
      !!currentProject.template && currentProject.template.id.trim()  !== "" &&      
      !!currentProject.repoName && currentProject.repoName.trim()     !== ""
    );
  }

  async createNewProject(that: this) {

    var item = that.state.currentProject;
    var repository = await CreateRepositoryAsync(item.repoName);

    const buildOptions: IBuildOptions = {
      name          : item.name,
      repositoryId  : repository.id,
      template      : item.template
    };

    var buildDef = await CreateBuildDefinitionAsync(buildOptions);
    
    item.id                 = Guid.create().toString();
    item.repoUrl            = repository.webUrl;
    item.buildDefinitionId  = buildDef.id;
    item.startTime          = new Date();

    that.service.saveProject(item).then(item => {
      that.props.onDismiss();
    });

  }

  render() {

    const { currentProject } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={this.props.onDismiss}
          titleProps={{ text: "Create new project" }}
          description={"Create new project from a template."}
          footerButtonProps={[
            { text: "Cancel", onClick: this.props.onDismiss},
            { text: "Create", 
              primary: true, 
              onClick: (event) => {
                this.createNewProject(this)
              }, 
              disabled: !this.isValid()
            }
          ]}>

          <div className="project--content">
            <div className="project--group">
              <TextField
                inputId="name"
                label="Name *"
                value={currentProject.name}
                placeholder="Name your project name"
                onChange={(event, value) => this.onInputChange(event, value, this)}
              />
            </div>

            <div className="project--group">
              <Dropdown
                ariaLabel="Basic"
                className="example-dropdown"
                placeholder="Select a template"
                items={this.props.template}
                onSelect={(event, item) => {
                  currentProject.template = item as ITemplate;
                  this.setState({ currentProject: currentProject });
                }}
              />
            </div>

            <div className="project--group">
              <label className="project--group-label">
                Repository name *
              </label>
              <div className="project--group">
                <TextField
                  inputId="repoName"
                  value={currentProject.repoName}
                  placeholder="Company.Service.Name"
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                />
              </div>
            </div>

          </div>

        </Panel>
      );
    }
    return null;
  }
}

export default ProjectPanel;
