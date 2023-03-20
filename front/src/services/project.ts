import * as DevOps from "azure-devops-extension-sdk";
import {
    IExtensionDataManager,
    IProjectPageService
} from "azure-devops-extension-api";

import {
    IProject,
} from "../model/project";

import { getStorageManager } from "./storage";
import { IService } from "./services";

export interface IProjectService extends IService {
    getProject(): Promise<IProject[]>;
    saveProject(project: IProject): Promise<IProject>;
    updateProject(project: IProject): Promise<void>;
    removeProject(id: string): Promise<void>;    
}

export const ProjectServiceId = "ProjectService";

export class ProjectService implements IProjectService {
    manager: IExtensionDataManager | undefined;

    constructor() {
        this.getManager();
    }

    async getProject(): Promise<IProject[]> {
        const manager = await this.getManager();

        try {
            return manager.getDocuments(await this._getCollection(), {
                defaultValue: []
            });
        } catch {
            return [];
        }
    }

    async saveProject(project: IProject): Promise<IProject> {
        const manager = await this.getManager();
        await manager.setDocument(await this._getCollection(), project);
        return project;
    }

    async updateProject(project: IProject): Promise<void> {
        const manager = await this.getManager();
        try {
            await manager.updateDocument(await this._getCollection(), project);
        } catch {
            // Ignore
        }
    }

    async removeProject(id: string): Promise<void> {
        const manager = await this.getManager();
        try {
            await manager.deleteDocument(await this._getCollection(), id);
        } catch {
            // Ignore
        }
    }

    async getManager(): Promise<IExtensionDataManager> {
        if (!this.manager) {
            this.manager = await getStorageManager();
        }
        return this.manager;
    }

    async _getCollection(): Promise<string> {
        const projectCollection = "BaseProjectCollections";
        const projectPageService = await DevOps.getService<IProjectPageService>(
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const projectInfo = await projectPageService.getProject();
        return `${projectCollection}-${projectInfo.id}`;
    }
}
