import { ITemplate } from "./template";

export interface IProject {
    id: string;
    name: string;
    typeId: string;
    repoName: string;
    status: string;
    template?: ITemplate;

    repoUrl?: string;
    buildDefinitionId?: number;
    startTime?: Date;
    endTime?: Date;
}