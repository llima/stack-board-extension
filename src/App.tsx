import React from 'react';
import './app.scss';

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
import Settings from './components/settings';
import Template from './components/template';


import {
  getStatusIndicatorData,
  IPipelineItem,
  pipelineItems,
  ReleaseType,
  ReleaseTypeText,
} from "./data/TableData";

import {
  ColumnMore,
  ITableColumn,
  SimpleTableCell,
  Table,
  TwoLineTableCell,
  ColumnSorting,
  SortOrder,
  sortItems,
} from "azure-devops-ui/Table";
import { Ago } from "azure-devops-ui/Ago";
import { Duration } from "azure-devops-ui/Duration";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Icon, IIconProps } from "azure-devops-ui/Icon";
import { Link } from "azure-devops-ui/Link";
import { Status, StatusSize } from "azure-devops-ui/Status";



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

  render()  {
    return (
      <Page>
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                #3: Add new header to sample site
              </HeaderTitle>
            </HeaderTitleRow>
            <HeaderDescription>
              Validation of 405810 triggered today at 6:27 pm
            </HeaderDescription>
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
            titleProps={{ text: "All pipelines" }}
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

        <Settings show={this.state.settingsExpanded} onDismiss={() => this.setState({ settingsExpanded: false })} />

        <Template show={this.state.createExpanded} onDismiss={() => this.setState({ createExpanded: false })} />

      </Page>
    );
  }

  columns: ITableColumn<IPipelineItem>[] = [
    {
      id: "name",
      name: "Pipeline",
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
      name: "Last run",
      renderCell: renderLastRunColumn,
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
          { id: "submenu-one", text: "SubMenuItem 1" },
          { id: "submenu-two", text: "SubMenuItem 2" },
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
          this.sortFunctions,
          this.columns,
          pipelineItems
        )
      );
    }
  );

  sortFunctions = [
    // Sort on Name column
    (item1: IPipelineItem, item2: IPipelineItem) => {
      return item1.name.localeCompare(item2.name);
    },
  ];

}


function renderNameColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IPipelineItem>,
  tableItem: IPipelineItem
): JSX.Element {
  return (
    <SimpleTableCell
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      key={"col-" + columnIndex}
      contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
    >
      <Status
        {...getStatusIndicatorData(tableItem.status).statusProps}
        className="icon-large-margin"
        size={StatusSize.l}
      />
      <div className="flex-row scroll-hidden">
        <Tooltip overflowOnly={true}>
          <span className="text-ellipsis">{tableItem.name}</span>
        </Tooltip>
      </div>
    </SimpleTableCell>
  );
}

function renderLastRunColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IPipelineItem>,
  tableItem: IPipelineItem
): JSX.Element {
  const { prName, prId, releaseType, branchName } = tableItem.lastRunData;
  const text = "#" + prId + " \u00b7 " + prName;
  const releaseTypeText = ReleaseTypeText({ releaseType: releaseType });
  const tooltip = `${releaseTypeText} from ${branchName} branch`;
  return (
    <TwoLineTableCell
      className="bolt-table-cell-content-with-inline-link no-v-padding"
      key={"col-" + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      line1={
        <span className="flex-row scroll-hidden">
          <Tooltip text={text} overflowOnly>
            <Link
              className="fontSizeM font-size-m text-ellipsis bolt-table-link bolt-table-inline-link"
              excludeTabStop
              href="#pr"
            >
              {text}
            </Link>
          </Tooltip>
        </span>
      }
      line2={
        <Tooltip text={tooltip} overflowOnly>
          <span className="fontSize font-size secondary-text flex-row flex-center text-ellipsis">
            {ReleaseTypeIcon({ releaseType: releaseType })}
            <span className="text-ellipsis" key="release-type-text" style={{ flexShrink: 10000 }}>
              {releaseTypeText}
            </span>
            <Link
              className="monospaced-text text-ellipsis flex-row flex-center bolt-table-link bolt-table-inline-link"
              excludeTabStop
              href="#branch"
            >
              {Icon({
                className: "icon-margin",
                iconName: "OpenSource",
                key: "branch-name",
              })}
              <span className="text-ellipsis">
                {branchName}
              </span>
            </Link>
          </span>
        </Tooltip>
      }
    />
  );
}

function renderDateColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IPipelineItem>,
  tableItem: IPipelineItem
): JSX.Element {
  return (
    <TwoLineTableCell
      key={"col-" + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      line1={WithIcon({
        className: "fontSize font-size",
        iconProps: { iconName: "Calendar" },
        children: (
          <Ago date={tableItem.lastRunData.startTime} /*format={AgoFormat.Extended}*/ />
        ),
      })}
      line2={WithIcon({
        className: "fontSize font-size bolt-table-two-line-cell-item",
        iconProps: { iconName: "Clock" },
        children: (
          <Duration
            startDate={tableItem.lastRunData.startTime}
            endDate={tableItem.lastRunData.endTime}
          />
        ),
      })}
    />
  );
}

function WithIcon(props: {
  className?: string;
  iconProps: IIconProps;
  children?: React.ReactNode;
}) {
  return (
    <div className={css(props.className, "flex-row flex-center")}>
      {Icon({ ...props.iconProps, className: "icon-margin" })}
      {props.children}
    </div>
  );
}

function ReleaseTypeIcon(props: { releaseType: ReleaseType }) {
  let iconName: string = "";
  switch (props.releaseType) {
    case ReleaseType.PrAutomated:
      iconName = "BranchPullRequest";
      break;
    default:
      iconName = "Tag";
  }

  return Icon({
    className: "bolt-table-inline-link-left-padding icon-margin",
    iconName: iconName,
    key: "release-type",
  });
}


export default App;
