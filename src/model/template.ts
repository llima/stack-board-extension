import { ISettings } from "./settings";

export interface ITemplate {
    id: string;
    name: string;
    typeId: string;
    repoName: string;
    status: string;
    repoUrl?: string;
    buildDefinitionId?: number;
    settings?: ISettings;
    startTime?: Date;
    endTime?: Date;
}