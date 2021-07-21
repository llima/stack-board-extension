import { ITemplate } from "./template";

export interface IBuildOptions {
    name: string;
    repositoryId: string;
    template: ITemplate;
}