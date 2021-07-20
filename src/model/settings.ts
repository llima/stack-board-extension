import { IStack } from "./stacks";

export interface ISettings {
    id: string;
    text: string;
    replaceKey: string;
    description: string;
    gitUrl: string;
    user: string;
    pass: string;
    tags: IStack[]
}