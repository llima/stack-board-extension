import * as React from "react";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ISimpleListCell } from "azure-devops-ui/List";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import {
    ISimpleTableCell,
    ITableColumn,
    SimpleTableCell,
    TwoLineTableCell,
  } from "azure-devops-ui/Table";

import { css } from "azure-devops-ui/Util";

import { Icon, IIconProps } from "azure-devops-ui/Icon";
import { Link } from "azure-devops-ui/Link";

import { Ago } from "azure-devops-ui/Ago";
import { Duration } from "azure-devops-ui/Duration";
import { Tooltip } from "azure-devops-ui/TooltipEx";

import { Pill, PillSize, PillVariant } from "azure-devops-ui/Pill";
import { PillGroup } from "azure-devops-ui/PillGroup";


export interface ITableItem extends ISimpleTableCell {
    name: ISimpleListCell;
    age: number;
    gender: string;
}

enum PipelineStatus {
    Running = "running",
    Succeeded = "succeeded",
    Failed = "failed",
    Warning = "warning",
}

export enum ReleaseType {
    PrAutomated,
    Tag,
    Scheduled,
    Manual,
}

function modifyNow(days: number, hours: number, minutes: number, seconds: number): Date {
    const now = new Date();
    const newDate = new Date(now);
    newDate.setDate(now.getDate() + days);
    newDate.setHours(now.getHours() + hours);
    newDate.setMinutes(now.getMinutes() + minutes);
    newDate.setSeconds(now.getSeconds() + seconds);
    return newDate;
}

export const pipelineItems = [
    {
        favorite: new ObservableValue<boolean>(true),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(0, -1, 23, 8),
            prId: 482,
            prName: "Added testing for get_service_instance_stats",
            releaseType: ReleaseType.PrAutomated,
            startTime: modifyNow(0, -1, 0, 0),
        },
        name: "enterprise-distributed-service",
        status: PipelineStatus.Running,
    },
    {
        favorite: new ObservableValue<boolean>(true),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(-1, 0, 5, 2),
            prId: 137,
            prName: "Update user service",
            releaseType: ReleaseType.Tag,
            startTime: modifyNow(-1, 0, 0, 0),
        },
        name: "microservice-architecture",
        status: PipelineStatus.Succeeded,
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "master",
            endTime: modifyNow(0, -2, 33, 1),
            prId: 32,
            prName: "Update user service",
            releaseType: ReleaseType.Scheduled,
            startTime: modifyNow(0, -2, 0, 0),
        },
        name: "mobile-ios-app",
        status: PipelineStatus.Succeeded,
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "test",
            endTime: modifyNow(0, -4, 4, 17),
            prId: 385,
            prName: "Add a request body validator",
            releaseType: ReleaseType.PrAutomated,
            startTime: modifyNow(0, -4, 0, 0),
        },
        name: "node-package",
        status: PipelineStatus.Succeeded,
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "develop",
            endTime: modifyNow(0, -6, 2, 8),
            prId: 792,
            prName: "Clean up notifications styling",
            releaseType: ReleaseType.Manual,
            startTime: modifyNow(0, -6, 0, 0),
        },
        name: "parallel-stages",
        status: PipelineStatus.Failed,
    },
    {
        favorite: new ObservableValue<boolean>(false),
        lastRunData: {
            branchName: "feature-123",
            endTime: modifyNow(-2, 0, 49, 52),
            prId: 283,
            prName: "Add extra padding on cells",
            releaseType: ReleaseType.PrAutomated,
            startTime: modifyNow(-2, 0, 0, 0),
        },
        name: "simple-web-app",
        status: PipelineStatus.Warning,
    },
];

interface IPipelineLastRun {
    startTime?: Date;
    endTime?: Date;
    prId: number;
    prName: string;
    releaseType: ReleaseType;
    branchName: string;
}

export interface IPipelineItem {
    name: string;
    status: PipelineStatus;
    lastRunData: IPipelineLastRun;
    favorite: ObservableValue<boolean>;
}

interface IStatusIndicatorData {
    statusProps: IStatusProps;
    label: string;
}

export function getStatusIndicatorData(status: string): IStatusIndicatorData {
    status = status || "";
    status = status.toLowerCase();
    const indicatorData: IStatusIndicatorData = {
        label: "Success",
        statusProps: { ...Statuses.Success, ariaLabel: "Success" },
    };
    switch (status) {
        case PipelineStatus.Failed:
            indicatorData.statusProps = { ...Statuses.Failed, ariaLabel: "Failed" };
            indicatorData.label = "Failed";
            break;
        case PipelineStatus.Running:
            indicatorData.statusProps = { ...Statuses.Running, ariaLabel: "Running" };
            indicatorData.label = "Running";
            break;
        case PipelineStatus.Warning:
            indicatorData.statusProps = { ...Statuses.Warning, ariaLabel: "Warning" };
            indicatorData.label = "Warning";

            break;
    }

    return indicatorData;
}

export function ReleaseTypeText(props: { releaseType: ReleaseType }) {
    switch (props.releaseType) {
        case ReleaseType.PrAutomated:
            return "PR Automated";
        case ReleaseType.Manual:
            return "Manually triggered";
        case ReleaseType.Scheduled:
            return "Scheduled";
        default:
            return "Release new-features";
    }
}


export function renderNameColumn(
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
  
  export function renderLastRunColumn(
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
  
  export function renderDateColumn(
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
  
  export function renderType(
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
        <PillGroup className="flex-row">
          <Pill size={PillSize.compact}>C#</Pill>
          <Pill size={PillSize.compact} variant={PillVariant.outlined}>
            TypeScript
          </Pill>
          <Pill
            color={this.lightColor}
            size={PillSize.compact}
            variant={PillVariant.colored}
            onClick={() => alert("MSSQL pill clicked!")}
          >
            MSSQL
          </Pill>
        </PillGroup>
      </SimpleTableCell>
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
