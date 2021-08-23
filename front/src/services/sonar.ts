import { IService } from "./services";
import { ISonarBranch, ISonarComponent, ISonarProject } from "../model/sonar";

export interface ISonarService extends IService {
    loadComponents(token: string, serverUrl: string): Promise<ISonarComponent[]>;
}

export const SonarServiceId = "SonarService";

export class SonarService implements ISonarService {

    async loadComponents(serverUrl: string, token: string): Promise<ISonarComponent[]> {

        let base64 = require('base-64');

        return new Promise<ISonarComponent[]>((resolve: (results: ISonarComponent[]) => void, reject: (error: any) => void): void => {

            fetch(serverUrl + "/api/components/search_projects?ps=100", {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + base64.encode(token + ":")
                }
            })
            .then(res => res.json())
            .then((data: ISonarProject) => {
                resolve(data.components);
            })
            .catch(function (error) {
                reject(error);
            });

        });

    }

    async loadBranches(serverUrl: string, token: string, project: string): Promise<ISonarBranch[]> {

        let base64 = require('base-64');

        return new Promise<ISonarBranch[]>((resolve: (results: ISonarBranch[]) => void, reject: (error: any) => void): void => {

            fetch(serverUrl + "/api/project_branches/list?project=" + project, {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + base64.encode(token + ":")
                }
            })
            .then(res => res.json())
            .then((data: ISonarBranch[]) => {
                resolve(data);
            })
            .catch(function (error) {
                reject(error);
            });

        });

    }

    
}
