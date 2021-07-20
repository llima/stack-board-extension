import { ISettings } from "./settings";

export interface IBuildOptions {
    name: string;
    repositoryId: string;
    settings: ISettings;
}