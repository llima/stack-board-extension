import React from 'react';
import './app.scss';

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
import SettingsPanel from './components/settings/settings-panel';
import TemplatePanel from './components/template/template-panel';

import * as DevOps from "azure-devops-extension-sdk";

import {
  renderNameColumn,
  renderLastRunColumn,
  renderDateColumn,
  renderType,
  IPipelineItem,
  pipelineItems
} from "./data/TableData";

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
import { Services } from './services/services';
import { ISettingsService, SettingsServiceId } from './services/settings';

interface IAppState {
  settingsExpanded: boolean;
  createExpanded: boolean;
}

class App extends React.Component<{}, IAppState>  {

  constructor(props: {}) {
    super(props);
    this.state = {
      settingsExpanded: false,
      createExpanded: false
    };
  }

  async componentWillMount() {
    DevOps.init();
    const service = Services.getService<ISettingsService>(
      SettingsServiceId
    );
    service.getSettings().then(items => {
      console.log(items);
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
              onClick={() => this.setState({ createExpanded: true })}
            />
            <Button ariaLabel="Add" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">

          <Card
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
          </Card>
        </div>

        <SettingsPanel show={this.state.settingsExpanded} onDismiss={() => this.setState({ settingsExpanded: false })} />
        <TemplatePanel show={this.state.createExpanded} onDismiss={() => this.setState({ createExpanded: false })} />

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

export default App;
