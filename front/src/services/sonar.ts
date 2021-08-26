import { IService } from "./services";
import { ISonarBranch, ISonarComponent, ISonarMeasure } from "../model/sonar";

export interface ISonarService extends IService {
    loadComponents(token: string, serverUrl: string): Promise<ISonarComponent[]>;
    loadBranches(serverUrl: string, token: string, project: string): Promise<ISonarBranch[]>;
    loadMeasures(serverUrl: string, token: string, component: string, branch: string): Promise<ISonarMeasure[]>;
    loadProjects(serverUrl: string, token: string, projects: string[]): Promise<ISonarComponent[]>;
}

export const SonarServiceId = "SonarService";

export class SonarService implements ISonarService {


    async loadProjects(serverUrl: string, token: string, projects: string[]): Promise<ISonarComponent[]> {

        let base64 = require('base-64');
        var projectsString = projects.join(","); 

        return new Promise<ISonarComponent[]>((resolve: (results: ISonarComponent[]) => void, reject: (error: any) => void): void => {

            fetch(serverUrl + "/api/projects/search?ps=100&projects=" + projectsString, {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + base64.encode(token + ":")
                }
            })
            .then(res => res.json())
            .then((data: any) => {
                resolve(data.components);
            })
            .catch(function (error) {
                reject(error);
            });

        });

    }

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
            .then((data: any) => {
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
            .then((data: any) => {
                resolve(data.branches);
            })
            .catch(function (error) {
                reject(error);
            });

        });

    }
    
    async loadMeasures(serverUrl: string, token: string, component: string, branch: string): Promise<ISonarMeasure[]> {

        let base64 = require('base-64');

        return new Promise<ISonarMeasure[]>((resolve: (results: ISonarMeasure[]) => void, reject: (error: any) => void): void => {

            var url = serverUrl + "/api/measures/component?component=" + component + "&metricKeys=alert_status%2Cbugs%2Creliability_rating%2Cvulnerabilities%2Csecurity_rating%2Csecurity_hotspots_reviewed%2Csecurity_review_rating%2Ccode_smells%2Csqale_rating%2Cduplicated_lines_density%2Ccoverage%2Cncloc%2Cncloc_language_distribution%2Cprojects&branch=" + branch;
            fetch(url, {
                method: "GET",
                mode: 'cors',
                headers: {
                    "Authorization": "Basic " + base64.encode(token + ":")
                }
            })
            .then(res => res.json())
            .then((data: any) => {
                resolve(data.component.measures);
            })
            .catch(function (error) {   
                reject(error);
            });

        });

    }

    
}
