import React from 'react';
import './projects-page.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { DeleteRepositoryAsync } from '../../services/repository';

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

import { ColumnMore, Table } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Services } from '../../services/services';
import { ITemplateService, TemplateServiceId, } from '../../services/template';
import { ITemplate } from '../../model/template';
import { IProjectService, ProjectServiceId } from '../../services/project';
import { IProject, ProjectStatus } from '../../model/project';
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import { columns } from './projects-page-settings';
import { DeletePipelineAsync, GetBuildStatusAsync } from '../../services/pipeline';

import ProjectPanel from '../../components/project/project-panel';
import TemplatePanel from '../../components/template/template-panel';
import ProjectModal from '../../components/project/project-modal';


interface IProjectsState {
  templateExpanded: boolean;
  projectExpanded: boolean;
  templates: ITemplate[];
  projects: IProject[];
  loading: boolean;
  showDelete: boolean;
  seletectedProject?: IProject;
}

class ProjectsPage extends React.Component<{}, IProjectsState>  {

  templateService = Services.getService<ITemplateService>(TemplateServiceId);
  projectService = Services.getService<IProjectService>(ProjectServiceId);
  intervalStatus: any;

  constructor(props: {}) {
    super(props);

    this.state = {
      showDelete: false,
      loading: true,
      templateExpanded: false,
      projectExpanded: false,
      templates: [],
      projects: [],
    };

    columns.push(new ColumnMore((listItem) => {
      return {
        id: "sub-menu",
        items: [
          { id: "delete", text: "Delete", onActivate: () => this.setState({ showDelete: true, seletectedProject: listItem }) },
        ],
      };
    }))

    this.loadProjects();
  }

  loadProjects() {
    this.templateService.getTemplate().then(templates => {
      this.setState({ templates: templates});

      this.projectService.getProject().then(projects => {
        var items = projects.sort((a: IProject, b: IProject) => {
          return b.startTime.getTime() - a.startTime.getTime();
        })
        this.setState({ projects: items, loading: false });
        this.setVerifyProjectStatus();
      }).catch(e => {
        this.setState({ loading: false });
      });
    }).catch(e => {
      this.setState({ loading: false });
    });
  }

  async setVerifyProjectStatus() {

    var that = this;
    var projects = that.state.projects;
    await that.verifyProjectStatus(projects, that);

    if (projects.filter(d => d.status === ProjectStatus.Running).length > 0) {
      that.intervalStatus = setInterval(async function () {
        await that.verifyProjectStatus(projects, that);
      }, 5000);
    }
  }

  async verifyProjectStatus(projects, that: this) {
    for (let index = 0; index < projects.length; index++) {
      const element = projects[index];
      if (element.status === ProjectStatus.Running) {
        element.status = await GetBuildStatusAsync(element.runBuildId)
        if (element.status === ProjectStatus.Succeeded)
          await DeletePipelineAsync(element.buildDefinitionId);
      }
    }
    if (projects.filter(d => d.status === ProjectStatus.Running).length === 0) {
      clearInterval(that.intervalStatus);
    }
    that.setState({ projects: projects });
  }

  async deleteProject(type: string, that: this) {

    if (type === "all") {
      await DeleteRepositoryAsync(that.state.seletectedProject.repoId);
      await DeletePipelineAsync(that.state.seletectedProject.buildDefinitionId);
    }

    that.projectService.removeProject(that.state.seletectedProject.id).then(() => {
      that.setState({ seletectedProject: null, showDelete: false });
      that.loadProjects();
    })
  }

  render() {

    const { projects, loading, templateExpanded, templates, projectExpanded, seletectedProject, showDelete } = this.state;

    return (
      <Page className="flex-grow">
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                Projects
              </HeaderTitle>
            </HeaderTitleRow>
            <HeaderDescription>
              Projects list generated from templates
            </HeaderDescription>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Add" }} primary={true}
              onClick={() => this.setState({ projectExpanded: true })}
            />
            <Button ariaLabel="Settings" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ templateExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">

          {!loading && projects.length === 0 && <ZeroData
            primaryText="Get started your first project"
            secondaryText={
              <span>
                Save time by creating a new project from templates.
              </span>
            }
            imageAltText="Bars"
            imagePath={"https://cdn.vsassets.io/ext/ms.vss-code-web/import-content/repoNotFound.bVoHtlP2mhhyPo5t.svg"}
            actionText="Create"
            actionType={ZeroDataActionType.ctaButton}
            onActionClick={(event, item) =>
              this.setState({ projectExpanded: true })
            } />
          }

          {!loading && projects.length > 0 && <Card
            className="flex-grow bolt-table-card"
            contentProps={{ contentPadding: false }}
            titleProps={{ text: "All projects" }}
          >
            <Observer itemProvider={new ObservableValue<ArrayItemProvider<IProject>>(
              new ArrayItemProvider(this.state.projects)
            )}>
              {(observableProps: { itemProvider: ArrayItemProvider<IProject> }) => (
                <Table
                  ariaLabel="Projects table"
                  columns={columns}
                  itemProvider={observableProps.itemProvider}
                  showLines={true}
                />
              )}
            </Observer>
          </Card>}

          {loading && <Card
            className="flex-grow bolt-table-card"
            contentProps={{ contentPadding: false }}
            titleProps={{ text: "All projects" }}
          >
            <Table<IProject>
              ariaLabel="Table shimmer"
              className="table-example"
              columns={columns}
              containerClassName="h-scroll-auto"
              itemProvider={new ObservableArray<
                IProject | ObservableValue<IProject | undefined>
              >(new Array(5).fill(new ObservableValue<IProject | undefined>(undefined)))}
              role="table"
            />
          </Card>}

        </div>

        <TemplatePanel show={templateExpanded} onDismiss={() => { this.setState({ templateExpanded: false, loading: true }); this.loadProjects() }} />
        <ProjectPanel show={projectExpanded} templates={templates} projects={projects} onDismiss={() => { this.setState({ projectExpanded: false, loading: false }); this.loadProjects() }} />
        <ProjectModal show={showDelete} project={seletectedProject} onDismiss={() => { this.setState({ seletectedProject: null, showDelete: false }); }} onConfirm={(type) => { this.deleteProject(type, this); }} />

      </Page>
    );
  }
}

export default ProjectsPage;
