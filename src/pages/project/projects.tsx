import React from 'react';
import './projects.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import TemplatePanel from '../../components/template/template-panel';

import {
  renderNameColumn,
  renderLastRunColumn,
  renderDateColumn,
  renderType,
  IPipelineItem,
  pipelineItems
} from "../../data/TableData";

import {
  ColumnMore,
  ITableColumn,
  Table,
  ColumnSorting,
  SortOrder,
  sortItems,
} from "azure-devops-ui/Table";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Services } from '../../services/services';
import { ITemplateService, TemplateServiceId, } from '../../services/template';
import { ITemplate } from '../../model/template';
import { IProjectService, ProjectServiceId } from '../../services/project';
import { IProject } from '../../model/project';

import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import ProjectPanel from '../../components/project/project-panel';

interface IProjectsState {
  templateExpanded: boolean;
  projectExpanded: boolean;
  template: ITemplate[];
  projects: IProject[];
}

class Projects extends React.Component<{}, IProjectsState>  {

  templateService = Services.getService<ITemplateService>(TemplateServiceId);
  projectService = Services.getService<IProjectService>(ProjectServiceId);

  constructor(props: {}) {
    super(props);

    this.state = {
      templateExpanded: false,
      projectExpanded: false,
      template: [],
      projects: []
    };

    this.loadTemplate();
    this.loadProjects();
  }

  loadTemplate() {
    this.templateService.getTemplate().then(items => {
      this.setState({ template: items });
    });
  }
  loadProjects() {
    this.projectService.getProject().then(items => {
      console.log(items);
      this.setState({ projects: items });
    });
  }

  render() {
    return (
      <Page >
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
          <ZeroData
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
            }
          />

          {/* <Card
            className="flex-grow bolt-table-card"
            contentProps={{ contentPadding: false }}
            titleProps={{ text: "All projects" }}
          >
            <Observer itemProvider={this.itemProvider}>
              {(observableProps: { itemProvider: ArrayItemProvider<IPipelineItem> }) => (
                <Table
                  ariaLabel="Advanced table"
                  behaviors={[this.sortingBehavior]}
                  className="table-example"
                  columns={this.columns}
                  containerClassName="h-scroll-auto"
                  itemProvider={observableProps.itemProvider}
                  showLines={true}
                  onSelect={(event, data) => console.log("Selected Row - " + data.index)}
                  onActivate={(event, row) => console.log("Activated Row - " + row.index)}
                />
              )}
            </Observer>
          </Card> */}
        </div>

        <TemplatePanel show={this.state.templateExpanded} onDismiss={() => { this.setState({ templateExpanded: false }); this.loadTemplate() }} />
        <ProjectPanel template={this.state.template} show={this.state.projectExpanded} onDismiss={() => { this.setState({ projectExpanded: false }); this.loadTemplate() }} />

      </Page>
    );
  }

  columns: ITableColumn<IPipelineItem>[] = [
    {
      id: "name",
      name: "Projects",
      renderCell: renderNameColumn,
      readonly: true,
      sortProps: {
        ariaLabelAscending: "Sorted A to Z",
        ariaLabelDescending: "Sorted Z to A",
      },
      width: -33,
    },
    {
      className: "pipelines-two-line-cell",
      id: "lastRun",
      name: "Template",
      renderCell: renderLastRunColumn,
      width: -33,
    },
    {
      id: "type",
      ariaLabel: "Time and duration",
      readonly: true,
      renderCell: renderType,
      width: -33,
    },
    {
      id: "time",
      ariaLabel: "Time and duration",
      readonly: true,
      renderCell: renderDateColumn,
      width: -33,
    },

    new ColumnMore(() => {
      return {
        id: "sub-menu",
        items: [
          { id: "download", text: "Download" },
          { id: "delete", text: "Delete" },
        ],
      };
    }),
  ];

  itemProvider = new ObservableValue<ArrayItemProvider<IPipelineItem>>(
    new ArrayItemProvider(pipelineItems)
  );

  sortingBehavior = new ColumnSorting<Partial<IPipelineItem>>(
    (columnIndex: number, proposedSortOrder: SortOrder) => {
      this.itemProvider.value = new ArrayItemProvider(
        sortItems(
          columnIndex,
          proposedSortOrder,
          [
            (item1: IPipelineItem, item2: IPipelineItem) => {
              return item1.name.localeCompare(item2.name);
            }
          ],
          this.columns,
          pipelineItems
        )
      );
    }
  );
}

export default Projects;
