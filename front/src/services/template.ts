import * as DevOps from "azure-devops-extension-sdk";
import {
    IExtensionDataManager,
    IProjectPageService
} from "azure-devops-extension-api";

import {
    ITemplate,
} from "../model/template";

import { getStorageManager } from "./storage";
import { IService } from "./services";

export interface ITemplateService extends IService {
    getTemplate(): Promise<ITemplate[]>;
    saveTemplate(template: ITemplate): Promise<ITemplate>;
    removeTemplate(id: string): Promise<void>;
}

export const TemplateServiceId = "TemplateService";

export class TemplateService implements ITemplateService {
    manager: IExtensionDataManager | undefined;

    constructor() {
        this.getManager();
    }

    async getTemplate(): Promise<ITemplate[]> {
        const manager = await this.getManager();

        try {
            return manager.getDocuments(await this._getCollection(), {
                defaultValue: []
            });
        } catch {
            return [];
        }
    }

    async saveTemplate(template: ITemplate): Promise<ITemplate> {
        console.log(template);
        const manager = await this.getManager();
        await manager.setDocument(await this._getCollection(), template);
        return template;
    }

    async removeTemplate(id: string): Promise<void> {
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
        const templateCollection = "BaseTemplateCollections";
        const projectPageService = await DevOps.getService<IProjectPageService>(
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const projectInfo = await projectPageService.getProject();
        return `${templateCollection}-${projectInfo.id}`;
    }
}
