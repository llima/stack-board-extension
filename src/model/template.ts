import { ISettings } from "./settings";

export interface ITemplate {
    id: string;
    name: string;
    typeId: string;
    repoName: string;
    status: string;
    settings?: ISettings;

    repoUrl?: string;
    buildDefinitionId?: number;
    startTime?: Date;
    endTime?: Date;
}