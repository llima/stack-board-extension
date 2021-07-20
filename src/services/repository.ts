import * as DevOps from "azure-devops-extension-sdk";
import { IHostNavigationService, IProjectPageService } from "azure-devops-extension-api";

import { getClient } from "azure-devops-extension-api";
import {
  GitRepository,
  GitRepositoryCreateOptions,
  GitRestClient,
} from "azure-devops-extension-api/Git";

const client: GitRestClient = getClient(GitRestClient);

export async function CreateRepositoryAsync(
  name: string
): Promise<GitRepository> {
  await DevOps.ready();
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  const currentProject = await projectService.getProject();

  const options = {} as GitRepositoryCreateOptions;
  options.name = name;

  return await client.createRepository(options, currentProject.name);
}