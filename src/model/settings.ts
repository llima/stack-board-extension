import { IStack } from "./stacks";

export interface ISettings {
    id: string;
    name: string;
    description: string;
    gitUrl: string;
    user: string;
    pass: string;
    tags: IStack[]
}