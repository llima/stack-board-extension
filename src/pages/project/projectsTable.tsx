import { Status, Statuses, StatusSize } from 'azure-devops-ui/Status';
import { ITableColumn, SimpleTableCell } from 'azure-devops-ui/Table';
import { Tooltip } from 'azure-devops-ui/TooltipEx';
import { IProject, IStatusIndicator, ProjectStatus } from '../../model/project';



export const projectsMock : IProject[] = [
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

export function renderNameColumn(
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
      <Status
        {...this.getStatusIndicator(tableItem.status).statusProps}
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