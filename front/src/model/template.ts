import { IStack } from "./stacks";

export interface ITemplate {
    id: string;
    text: string;
    replaceKey: string;
    replaceTeamKey: string;
    description: string;
    gitUrl: string;
    user: string;
    pass: string;
    branch: string;
    tags: IStack[]
}