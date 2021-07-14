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
    saveSettings(session: ISettings): Promise<ISettings>;
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
            // Try legacy and current collection
            const settings: ISettings[][] = await Promise.all(
                [
                    manager.getDocuments("SourceSettings", {
                        defaultValue: []
                    }),
                    manager.getDocuments(await this._getCollection(), {
                        defaultValue: []
                    })
                ].map(p => p.catch(() => []))
            );

            return settings.flat();
        } catch {
            return [];
        }
    }
    
    async saveSettings(session: ISettings): Promise<ISettings> {
        const manager = await this.getManager();
        await manager.setDocument(await this._getCollection(), session);
        return session;
    }

    async removeSettings(id: string): Promise<void> {
        const manager = await this.getManager();

        try {
            await manager.deleteDocument(await this._getCollection(), id);
        } catch {
            try {
                await manager.deleteDocument("SourceSettings", id);
            } catch {
                // Ignore
            }
        }
    }

    async getManager(): Promise<IExtensionDataManager> {
        if (!this.manager) {
            this.manager = await getStorageManager();
        }

        return this.manager;
    }

    async _getCollection(): Promise<string> {
        const SettingsCollection = "SourceSettings";
        const projectPageService = await DevOps.getService<IProjectPageService>(
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const projectInfo = await projectPageService.getProject();
        return `${SettingsCollection}-${projectInfo.id}`;
    }
}
