import { IUserContext } from "azure-devops-extension-sdk";
import { IStatusProps } from "azure-devops-ui/Status";
import { ITemplate } from "./template";

export interface IProject {
    id: string;
    name: string;
    team: string;
    repoName: string;
    status: string;
    template?: ITemplate;

    repoUrl?: string;
    repoId?: string;

    buildDefinitionId?: number;
    runBuildId?: number;
    startTime?: Date;
    endTime?: Date;

    user?: IUserContext;
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