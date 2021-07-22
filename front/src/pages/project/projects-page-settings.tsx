import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";

import {
  ITableColumn,
  SimpleTableCell,
  TwoLineTableCell,
} from "azure-devops-ui/Table";

import { css } from "azure-devops-ui/Util";
import { Icon, IIconProps } from "azure-devops-ui/Icon";

import { Ago } from "azure-devops-ui/Ago";
import { Duration } from "azure-devops-ui/Duration";
import { Pill, PillSize } from "azure-devops-ui/Pill";

import { IProject, IStatusIndicator, ProjectStatus } from "../../model/project";
import { PillGroup } from "azure-devops-ui/PillGroup";
import { Link } from "azure-devops-ui/Link";



export const projectsMock: IProject[] = [
  {
    "id": "dd685ebc-19ee-5517-1b3f-329178b21137",
    "name": "Push2",
    "repoName": "Eleve.Service.Push2",
    "status": "running",
    "template": {
      "id": "b7a9ce66-96d3-2e69-61c3-80cf54a7eabe",
      "replaceKey": "AppName",
      "text": "React App",
      "description": "um has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to m",
      "gitUrl": "https://dev.azure.com/elevenfinancial/Tribe%20-%20PeD/_git/Eleven.Libs.Foundation",
      "user": "",
      "pass": "",
      "tags": [
        {
          "id": 3,
          "text": "React"
        },
        {
          "id": 1,
          "text": "C#"
        }
      ],
    },
    "repoUrl": "https://dev.azure.com/elevenfinancial/Tribe%20-%20PeD/_git/Eleve.Service.Push2",
    "buildDefinitionId": 57,
    "startTime": new Date(),
  },
  {
    "id": "f121ae71-e50d-db4b-20f4-5b9bd13dfd99",
    "name": "Push3",
    "repoName": "Eleve.Service.Push3",
    "status": "running",
    "template": {
      "id": "e219db83-30e1-3bec-88bd-b58d13ef842d",
      "replaceKey": "ServiceName",
      "text": "Microservice",
      "description": "um has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to m",
      "gitUrl": "https://dev.azure.com/elevenfinancial/Tribe%20-%20PeD/_git/Eleven.Libs.Foundation",
      "user": "",
      "pass": "",
      "tags": [
        {
          "id": 1,
          "text": "C#"
        }
      ],
    },
    "repoUrl": "https://dev.azure.com/elevenfinancial/Tribe%20-%20PeD/_git/Eleve.Service.Push3",
    "buildDefinitionId": 58,
    "startTime": new Date(),
  }
];

export var columns: ITableColumn<IProject>[] = [
  {
    id: "Status",
    name: "Status",
    renderCell: renderStatusColumn,
    readonly: true,
    width: 60,
  },
  {
    id: "name",
    name: "Project",
    renderCell: renderNameColumn,
    readonly: true,
    width: -20,
  },
  {
    className: "pipelines-two-line-cell",
    id: "repository",
    name: "Repository",
    renderCell: renderTemplateColumn,
    width: -40,
  },
  {
    id: "type",
    ariaLabel: "Stack",
    readonly: true,
    renderCell: renderTagsColumn,
    width: -20,
  },
  {
    id: "time",
    ariaLabel: "Time and duration",
    readonly: true,
    renderCell: renderDateColumn,
    width: -20,
  }
];

export function getStatusIndicator(status: string): IStatusIndicator {
  status = status || "";
  status = status.toLowerCase();
  const indicatorData: IStatusIndicator = {
    label: "Success",
    statusProps: { ...Statuses.Success, ariaLabel: "Success" },
  };
  switch (status) {
    case ProjectStatus.Failed:
      indicatorData.statusProps = { ...Statuses.Failed, ariaLabel: "Failed" };
      indicatorData.label = "Failed";
      break;
    case ProjectStatus.Running:
      indicatorData.statusProps = { ...Statuses.Running, ariaLabel: "Running" };
      indicatorData.label = "Running";
      break;
    case ProjectStatus.Warning:
      indicatorData.statusProps = { ...Statuses.Warning, ariaLabel: "Warning" };
      indicatorData.label = "Warning";

      break;
  }

  return indicatorData;
}

export function renderStatusColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IProject>,
  tableItem: IProject
): JSX.Element {
  return (
    <SimpleTableCell
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      key={"col-" + columnIndex}
    >
      <Status
        {...getStatusIndicator(tableItem.status).statusProps}
        className="icon-large-margin"
        size={StatusSize.l}
      />

    </SimpleTableCell>
  );
}

export function renderNameColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IProject>,
  tableItem: IProject
): JSX.Element {
  return (
    <TwoLineTableCell
      key={"col-" + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      line1={
        <div className="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden">
          <span className="text-ellipsis">{tableItem.name}</span>
        </div>
      }
      line2={
        <span className="fontSize font-size secondary-text flex-row flex-center text-ellipsis">
          {Icon({
            className: "icon-margin",
            iconName: "FileCode",
            key: "release-type",
          })}
          <span className="text-ellipsis" key="release-type-text" style={{ flexShrink: 10000 }}>
            {tableItem.template.text}
          </span>
        </span>
      }
    />
  );
}

export function renderTemplateColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IProject>,
  tableItem: IProject
): JSX.Element {
  return (
    <TwoLineTableCell
      className="bolt-table-cell-content-with-inline-link no-v-padding"
      key={"col-" + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      line1={
        <span className="flex-row scroll-hidden">
          <Link
            className="fontSizeM font-size-m text-ellipsis bolt-table-link bolt-table-inline-link"
            excludeTabStop
            target="_blank"
            href={tableItem.repoUrl}>
            {tableItem.repoName}
          </Link>
        </span>
      }
      line2={
        <span className="fontSize font-size secondary-text flex-row flex-center text-ellipsis">
          <Link
            className="monospaced-text text-ellipsis flex-row flex-center bolt-table-link bolt-table-inline-link"
            excludeTabStop
            target="_blank"
            href={tableItem.repoUrl}
          >
            {Icon({
              className: "icon-margin",
              iconName: "OpenSource",
              key: "branch-name",
            })}
            <span className="text-ellipsis">
              {tableItem.repoUrl}
            </span>
          </Link>
        </span>
      }
    />
  );
}

export function renderTagsColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IProject>,
  tableItem: IProject
): JSX.Element {
  return (
    <SimpleTableCell
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      key={"col-" + columnIndex}
      contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
    >
      <PillGroup className="flex-row">
        {tableItem.template.tags.map(tag => (
          <Pill size={PillSize.compact}>{tag.text}</Pill>
        ))}
      </PillGroup>

    </SimpleTableCell>
  );
}

export function renderDateColumn(
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<IProject>,
  tableItem: IProject
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
          <Ago date={tableItem.startTime} />
        ),
      })}
      line2={WithIcon({
        className: "fontSize font-size bolt-table-two-line-cell-item",
        iconProps: { iconName: "Clock" },
        children: (
          <Duration
            startDate={tableItem.startTime}
            endDate={tableItem.endTime}
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

