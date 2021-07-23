import React from 'react';
import './project-panel.scss';

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Dropdown } from "azure-devops-ui/Dropdown";

import { CreateRepositoryAsync } from '../../services/repository';
import { CreateBuildDefinitionAsync, RunBuild } from '../../services/pipeline';
import { ITemplate } from '../../model/template';
import { IProject } from '../../model/project';
import { Guid } from 'guid-typescript';
import { Services } from '../../services/services';
import { IProjectService, ProjectServiceId } from '../../services/project';
import { IBuildOptions } from '../../model/buildOptions';
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { FormItem } from "azure-devops-ui/FormItem";
import { ObservableValue } from 'azure-devops-ui/Core/Observable';

export interface IProjectPanelProps {
  show: boolean;
  onDismiss: any;
  templates: ITemplate[];
  projects: IProject[];
}

interface IProjectPanelState {
  currentProject: IProject;
  nameIsValid: boolean;
  repoIsValid: boolean;
}

class ProjectPanel extends React.Component<IProjectPanelProps, IProjectPanelState>  {

  errorObservable = new ObservableValue<string>("");
  service = Services.getService<IProjectService>(
    ProjectServiceId
  );

  constructor(props: IProjectPanelProps) {
    super(props);
    this.state = {
      currentProject: this.getStartValue(),
      nameIsValid: true,
      repoIsValid: true
    };
  }

  getStartValue(): IProject {
    return {
      id: "",
      name: "",
      repoName: "",
      status: "running",
      template: null
    };
  }

  close(that: this) {
    that.setState({ currentProject: that.getStartValue() }, () => {
      that.props.onDismiss();
    });
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.state.currentProject[prop] = value;

    if (prop === "name" && that.props.projects.filter(d => d.name.toLocaleLowerCase() === that.state.currentProject.name.toLocaleLowerCase()).length > 0) {
      that.setState({ nameIsValid: false, currentProject: that.state.currentProject });
      return;
    }

    if (prop === "repoName" && that.props.projects.filter(d => d.repoName.toLocaleLowerCase() === that.state.currentProject.repoName.toLocaleLowerCase()).length > 0) {
      that.setState({ repoIsValid: false, currentProject: that.state.currentProject });
      return;
    }

    this.setState({ currentProject: that.state.currentProject, nameIsValid: true, repoIsValid: true });
  }

  isValid(): boolean {
    const { currentProject, repoIsValid, nameIsValid } = this.state;

    return (
      repoIsValid && nameIsValid &&
      !!currentProject.name && currentProject.name.trim() !== "" &&
      !!currentProject.template && currentProject.template.id.trim() !== "" &&
      !!currentProject.repoName && currentProject.repoName.trim() !== ""
    );
  }

  async createNewProject(that: this) {

    var item = that.state.currentProject;
    var repository = await CreateRepositoryAsync(item.repoName);

    const buildOptions: IBuildOptions = {
      name: item.name,
      repositoryId: repository.id,
      template: item.template
    };
    var buildDef = await CreateBuildDefinitionAsync(buildOptions);
    await RunBuild(buildDef.id);

    item.id = Guid.create().toString();
    item.repoUrl = repository.webUrl;
    item.buildDefinitionId = buildDef.id;
    item.startTime = new Date();

    that.service.saveProject(item).then(item => {
      that.close(that);
    });
  }

  render() {

    const { currentProject, nameIsValid, repoIsValid } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={() => {
            this.close(this);
          }}
          titleProps={{ text: "Create new project" }}
          description={"Create new project from a template."}
          footerButtonProps={[
            {
              text: "Cancel", onClick: (event) => {
                this.close(this);
              }
            },
            {
              text: "Create",
              primary: true,
              onClick: (event) => {
                this.createNewProject(this)
              },
              disabled: !this.isValid()
            }
          ]}>

          <div className="project--content">

            <div className="project--group">
              <Dropdown
                ariaLabel="Basic"                
                className="example-dropdown"
                placeholder="Select a template"
                items={this.props.templates}
                onSelect={(event, item) => {
                  currentProject.template = item as ITemplate;
                  this.setState({ currentProject: currentProject });
                }}
              />
            </div>

            {currentProject.template && <div className="project--group">
              <MessageCard
                className="flex-self-stretch"
                severity={MessageCardSeverity.Info}>
                {currentProject.template.description}
              </MessageCard>
            </div>}

            <div className="project--group">
              <FormItem message="the project name must be unique" error={!nameIsValid}>
                <TextField
                  inputId="name"
                  label="Name *"
                  value={currentProject.name}
                  placeholder="Name your project name"
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                />
              </FormItem>
            </div>

            <div className="project--group">
              <FormItem message="the repository name must be unique" error={!repoIsValid}>
                <TextField
                  inputId="repoName"
                  label="Repository name *"
                  value={currentProject.repoName}
                  placeholder="Company.Service.Name"
                  onChange={(event, value) => this.onInputChange(event, value, this)}
                />
              </FormItem>
            </div>

          </div>

        </Panel>
      );
    }
    return null;
  }
}

export default ProjectPanel;
