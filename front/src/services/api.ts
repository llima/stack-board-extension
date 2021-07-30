import * as DevOps from "azure-devops-extension-sdk";
import {
    IExtensionDataManager,
    IProjectPageService
} from "azure-devops-extension-api";

import {
    IApi,
} from "../model/api";

import { getStorageManager } from "./storage";
import { IService } from "./services";

export interface IApiService extends IService {
    getApi(): Promise<IApi[]>;
    saveApi(api: IApi): Promise<IApi>;
    removeApi(id: string): Promise<void>;
}

export const ApiServiceId = "ApiService";

export class ApiService implements IApiService {
    manager: IExtensionDataManager | undefined;

    constructor() {
        this.getManager();
    }

    async getApi(): Promise<IApi[]> {
        const manager = await this.getManager();

        try {
            return manager.getDocuments(await this._getCollection(), {
                defaultValue: []
            });
        } catch {
            return [];
        }
    }

    async saveApi(api: IApi): Promise<IApi> {
        const manager = await this.getManager();
        await manager.setDocument(await this._getCollection(), api);
        return api;
    }

    async removeApi(id: string): Promise<void> {
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
        const apiCollection = "BaseApiCollections";
        const apiPageService = await DevOps.getService<IProjectPageService>(
            "ms.vss-tfs-web.tfs-page-data-service"
        );
        const apiInfo = await apiPageService.getProject();
        return `${apiCollection}-${apiInfo.id}`;
    }
}
