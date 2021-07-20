import React from 'react';
import './template-panel.scss';

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { Dropdown } from "azure-devops-ui/Dropdown";

import { CreateRepositoryAsync } from '../../services/repository';
import { CreateBuildDefinitionAsync } from '../../services/build';
import { ISettings } from '../../model/settings';
import { ITemplate } from '../../model/template';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { Guid } from 'guid-typescript';
import { Services } from '../../services/services';
import { ITemplateService, TemplateServiceId } from '../../services/template';
import { IBuildOptions } from '../../model/buildOptions';

export interface ITemplatePanelProps {
  show: boolean;
  onDismiss: any;
  settings: ISettings[];
}

interface ITemplatePanelState {
  currentTemplate: ITemplate;
}

class TemplatePanel extends React.Component<ITemplatePanelProps, ITemplatePanelState>  {

  service = Services.getService<ITemplateService>(
    TemplateServiceId
  );

  constructor(props: ITemplatePanelProps) {
    super(props);
    this.state = {
      currentTemplate: {
        id: "",
        name: "",
        typeId: "",
        repoName: "",
        status: "running",
      }
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
    const { currentTemplate } = this.state;

    return (
      !!currentTemplate.name && currentTemplate.name.trim() !== "" &&
      !!currentTemplate.typeId && currentTemplate.typeId.trim() !== "" &&
      !!currentTemplate.repoName && currentTemplate.repoName.trim() !== ""
    );
  }

  createNewProject(that: this) {
    try {

      var item = that.state.currentTemplate;

      CreateRepositoryAsync(item.repoName).then(repository => {
        const buildOptions : IBuildOptions = {    
          name: item.name,
          repositoryId: repository.id,
          repositoryUrl: item.settings.gitUrl,
          replaceKey: item.settings.replaceKey,
          user: item.settings.user,
          pass: item.settings.pass
        };
        
        CreateBuildDefinitionAsync(buildOptions).then(buildDef => {
          item.id = Guid.create().toString();
          item.repoUrl = repository.url;
          item.buildDefinitionId = buildDef.id;
          item.startTime = new Date();

          that.service.saveTemplate(item).then(item => {
            that.props.onDismiss();
          });
        });
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  render() {

    const { currentTemplate } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={this.props.onDismiss}
          titleProps={{ text: "Create new project" }}
          description={
            "Create new project configuration from template."
          }
          footerButtonProps={[
            { text: "Cancel", onClick: this.props.onDismiss, },
            {
              text: "Create", primary: true, onClick: (event) => {
                this.createNewProject(this)
              }, disabled: !this.isValid()
            }
          ]}>

          <div className="template--content">
            <div className="template--group">
              <TextField
                inputId="name"
                label="Name *"
                value={currentTemplate.name}
                placeholder="Name your template name"
                onChange={(event, value) => this.onInputChange(event, value, this)}
              />
            </div>

            <div className="template--group">
              <Dropdown
                ariaLabel="Basic"
                className="example-dropdown"
                placeholder="Select a type"
                items={this.props.settings}
                onSelect={(event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<ISettings>) => {
                  currentTemplate.typeId = item.id;
                  currentTemplate.settings = item.data;
                  this.setState({ currentTemplate: currentTemplate });
                }}
              />
            </div>

            <div className="template--group">
              <label className="template--group-label">
                Repository name *
              </label>
              <div className="template--group">
                <TextField
                  inputId="repoName"
                  value={currentTemplate.repoName}
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

export default TemplatePanel;
