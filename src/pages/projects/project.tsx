import React from 'react';
import './project.scss';

import {
  CustomHeader,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import SettingsPanel from '../../components/settings/settings-panel';
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
import { ISettingsService, SettingsServiceId, } from '../../services/settings';
import { ISettings } from '../../model/settings';
import { ITemplateService, TemplateServiceId } from '../../services/template';
import { ITemplate } from '../../model/template';

import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";

interface IProjectState {
  settingsExpanded: boolean;
  templateExpanded: boolean;
  settings: ISettings[];
  templates: ITemplate[];
}

class Project extends React.Component<{}, IProjectState>  {

  settingsService = Services.getService<ISettingsService>(SettingsServiceId);
  templateService = Services.getService<ITemplateService>(TemplateServiceId);

  constructor(props: {}) {
    super(props);

    this.state = {
      settingsExpanded: false,
      templateExpanded: false,
      settings: [],
      templates: []
    };

    this.loadSettings();
    this.loadTemplates();
  }

  loadSettings() {
    this.settingsService.getSettings().then(items => {
      this.setState({ settings: items });
    });
  }
  loadTemplates() {
    this.templateService.getTemplate().then(items => {
      console.log(items);
      this.setState({ templates: items });
    });
  }

  render() {
    return (
      <Page>
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                Stack board
              </HeaderTitle>
            </HeaderTitleRow>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Add" }} primary={true}
              onClick={() => this.setState({ templateExpanded: true })}
            />
            <Button ariaLabel="Add" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">
          <ZeroData
            primaryText="This is the primary text"
            secondaryText={
              <span>
                This secondary text contains a{" "}
                <a
                  rel="nofollow noopener"
                  target="_blank"
                  href="https://bing.com"
                  aria-label="link to bing.com"
                >
                  link
                </a>{" "}
                to somewhere else. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit.
              </span>
            }
            imageAltText="Bars"
            imagePath={"https://cdn.vsassets.io/ext/ms.vss-code-web/import-content/repoNotFound.bVoHtlP2mhhyPo5t.svg"}
            actionText="Button"
            actionType={ZeroDataActionType.ctaButton}
            onActionClick={(event, item) =>
              alert("Hey, you clicked the button for " + item!.primaryText)
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

        <SettingsPanel show={this.state.settingsExpanded} onDismiss={() => { this.setState({ settingsExpanded: false }); this.loadSettings() }} />
        <TemplatePanel settings={this.state.settings} show={this.state.templateExpanded} onDismiss={() => { this.setState({ templateExpanded: false }); this.loadSettings() }} />

      </Page>
    );
  }

  columns: ITableColumn<IPipelineItem>[] = [
    {
      id: "name",
      name: "Project",
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
      name: "Settings",
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

export default Project;
