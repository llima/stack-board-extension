import * as DevOps from "azure-devops-extension-sdk";
import {
  IExtensionDataManager,
  IProjectPageService,
} from "azure-devops-extension-api";

import { ICode } from "../model/code";

import { getStorageManager } from "./storage";
import { IService } from "./services";

export interface ICodeService extends IService {
  getCode(): Promise<ICode[]>;
  saveCode(code: ICode): Promise<ICode>;
  removeCode(id: string): Promise<void>;
  removeAll(): Promise<void>;
}

export const CodeServiceId = "CodeService";

export class CodeService implements ICodeService {
  manager: IExtensionDataManager | undefined;

  constructor() {
    this.getManager();
  }

  async getCode(): Promise<ICode[]> {
    const manager = await this.getManager();

    try {
      return manager.getDocuments(await this._getCollection(), {
        defaultValue: [],
      });
    } catch {
      return [];
    }
  }

  async saveCode(code: ICode): Promise<ICode> {
    const manager = await this.getManager();
    await manager.setDocument(await this._getCollection(), code);
    return code;
  }

  async removeCode(id: string): Promise<void> {
    const manager = await this.getManager();
    try {
      await manager.deleteDocument(await this._getCollection(), id);
    } catch {
      // Ignore
    }
  }

  async removeAll(): Promise<void> {
    const manager = await this.getManager();
    try {
      const documents = await manager.getDocuments(await this._getCollection());
      for (let index = 0; index < documents.length; index++) {
        const element = documents[index];
        await manager.deleteDocument(await this._getCollection(), element.id);
      }
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
    const codeCollection = "BaseCodeCollections";
    const codePageService = await DevOps.getService<IProjectPageService>(
      "ms.vss-tfs-web.tfs-page-data-service"
    );
    const codeInfo = await codePageService.getProject();
    return `${codeCollection}-${codeInfo.id}`;
  }
}
