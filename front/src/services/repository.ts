import * as DevOps from "azure-devops-extension-sdk";
import { IProjectPageService } from "azure-devops-extension-api";

import { getClient } from "azure-devops-extension-api";
import {
  GitChange,
  GitCommitRef,
  GitItem,
  GitPush,
  GitRefUpdate,
  GitRepository,
  GitRepositoryCreateOptions,
  GitRestClient,  
  ItemContent,
  ItemContentType,
  VersionControlChangeType,
} from "azure-devops-extension-api/Git";

const client: GitRestClient = getClient(GitRestClient);

export interface RepoChange {
  path: string;
}

export async function CreateRepositoryAsync(
  name: string
): Promise<GitRepository> {
  
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  const currentProject = await projectService.getProject();

  const options = {} as GitRepositoryCreateOptions;
  options.name = name;

  var repository = await client.createRepository(options, currentProject.name);

  var gitRefUpdate = {} as GitRefUpdate;
  gitRefUpdate.name = "refs/heads/develop";
  gitRefUpdate.oldObjectId = "0000000000000000000000000000000000000000";

  var item = {} as GitItem;
  item.path = "/README.md";

  var itemContent = {} as ItemContent;
  itemContent.content = itemContent.content = "### Made with Stack Board Extensions";
  itemContent.contentType = ItemContentType.RawText;

  var change = {} as GitChange;
  change.changeType = VersionControlChangeType.Add;
  change.item = item;
  change.newContent = itemContent;

  var gitCommitRef = {} as GitCommitRef;  
  gitCommitRef.comment = "Initial repository made with Stack Board Extensions!";  
  gitCommitRef.changes = [change];

  var push = {} as GitPush;  
  push.refUpdates = [gitRefUpdate];
  push.commits = [gitCommitRef];

  await client.createPush(push, repository.id, currentProject.name);

  return repository;
}

export async function DeleteRepositoryAsync(
  id: string
): Promise<void> {
  
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  
  const currentProject = await projectService.getProject();
  return await client.deleteRepository(id, currentProject.name);
}