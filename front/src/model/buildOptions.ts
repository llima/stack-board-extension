import { IUserContext } from "azure-devops-extension-sdk";
import { ITemplate } from "./template";

export interface IBuildOptions {
    name: string;
    repositoryId: string;
    template: ITemplate;
    user: IUserContext;
}