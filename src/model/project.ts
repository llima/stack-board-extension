import { IStatusProps } from "azure-devops-ui/Status";
import { ITemplate } from "./template";

export interface IProject {
    id: string;
    name: string;
    repoName: string;
    status: string;
    template?: ITemplate;

    repoUrl?: string;
    buildDefinitionId?: number;
    startTime?: Date;
    endTime?: Date;
}

export interface IStatusIndicator {
    statusProps: IStatusProps;
    label: string;
}

export enum ProjectStatus {
    Running = "running",
    Succeeded = "succeeded",
    Failed = "failed",
    Warning = "warning",
}