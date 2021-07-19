import * as DevOps from "azure-devops-extension-sdk";
import {
    IExtensionDataManager,
    IProjectPageService
} from "azure-devops-extension-api";

import {
    ISettings,
} from "../model/settings";

import { getStorageManager } from "./storage";
import { IService } from "./services";

export interface ISettingsService extends IService {
    getSettings(): Promise<ISettings[]>;
    saveSettings(settings: ISettings): Promise<ISettings>;
    removeSettings(id: string): Promise<void>;
}

export const SettingsServiceId = "SettingsService";

export class SettingsService implements ISettingsService {
    manager: IExtensionDataManager | undefined;

    constructor() {
        this.getManager();
    }

    async getSettings(): Promise<ISettings[]> {
        const manager = await this.getManager();

        try {
            return manager.getDocuments(await this._getCollection(), {
                defaultValue: []
            });
        } catch {
            return [];
        }
    }

    async saveSettings(settings: ISettings): Promise<ISettings> {
        console.log(settings);
        const manager = await this.getManager();
        await manager.setDocument(await this._getCollection(), settings);
        return settings;
    }

    async removeSettings(id: string): Promise<void> {
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
        const SettingsCollection = "SourceSettingsCollections";
        const projectPageService = await DevOps.getService<IProjectPageService>(
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const projectInfo = await projectPageService.getProject();
        return `${SettingsCollection}-${projectInfo.id}`;
    }
}
