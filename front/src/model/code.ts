import { ISonarComponent } from "./sonar";

export interface ICode {
    id?: string;
    type: string;
    server: string;
    token: string;
    components?: ISonarComponent[];
}


