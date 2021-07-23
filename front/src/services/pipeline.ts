import * as DevOps from "azure-devops-extension-sdk";
import { IProjectPageService } from "azure-devops-extension-api";

import { getClient } from "azure-devops-extension-api";
import {
  AgentPoolQueue,
  AgentSpecification,
  Build,
  BuildDefinition,
  BuildDefinitionStep,
  BuildDefinitionVariable,
  BuildRepository,
  BuildRestClient,
  DefinitionType,
  DesignerProcess,
  DesignerProcessTarget,
  Phase,
  TaskAgentPoolReference,
  TaskDefinitionReference,
} from "azure-devops-extension-api/Build";
import { IBuildOptions } from "../model/buildOptions";

const client: BuildRestClient = getClient(BuildRestClient);

export interface PhaseTargetScript {
  type: number;
  allowScriptsAuthAccessOption: boolean;
}

export async function CreateBuildDefinitionAsync(
  options: IBuildOptions
): Promise<BuildDefinition> {
  await DevOps.ready();
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  const currentProject = await projectService.getProject();

  const repository = {} as BuildRepository;
  repository.type = "TfsGit";
  repository.id = options.repositoryId;
  repository.defaultBranch = "refs/heads/develop";

  const agent = {} as AgentSpecification;
  agent.identifier = "ubuntu-20.04";

  const target = {} as DesignerProcessTarget;
  target.agentSpecification = agent;

  const phaseTarget = {} as PhaseTargetScript;
  phaseTarget.type = 1;
  phaseTarget.allowScriptsAuthAccessOption = true;

  const task = {} as TaskDefinitionReference;
  task.id = "4c770a38-2b38-4144-aae5-32d81b7a5c0c";
  task.versionSpec = "0.*";
  task.definitionType = "task";

  const step = {} as BuildDefinitionStep;
  step.task = task;
  step.displayName = "Stack Board Repos";
  step.enabled = true;
  step.inputs = { 
    sourceRepository: options.template.gitUrl,
    replaceFrom: options.template.replaceKey,
    replaceTo: options.name
  };

  const phase = {} as Phase;
  phase.name = "Agent job 1";
  phase.refName = "Job_1";
  phase.condition = "succeeded()";
  phase.jobAuthorizationScope = 1;
  phase.target = phaseTarget;
  phase.steps = [step];

  const designerProcess = {} as DesignerProcess;
  designerProcess.type = 1;
  designerProcess.target = target;
  designerProcess.phases = [phase];

  const taskAgentPoolReference = {} as TaskAgentPoolReference;
  taskAgentPoolReference.isHosted = true;
  taskAgentPoolReference.name = "Azure Pipelines";

  const agentPoolQueue = {} as AgentPoolQueue;
  agentPoolQueue.pool = taskAgentPoolReference;
  agentPoolQueue.name = "Azure Pipelines";

  const definition = {} as BuildDefinition;
  definition.name = `STACKBOARD-REPOS-${options.name.toUpperCase()}`;
  definition.type = DefinitionType.Build;
  definition.repository = repository;
  definition.process = designerProcess;
  definition.queue = agentPoolQueue;

  const PAT = {} as BuildDefinitionVariable;
  PAT.isSecret = true;  
  PAT.value = options.template.pass;

  const userName = {} as BuildDefinitionVariable;
  userName.isSecret = true;
  userName.value = options.template.user;

  const userInfo = {} as BuildDefinitionVariable;
  userInfo.isSecret = true;
  userInfo.value = "renato.dans@elevenfinancial.com|Renato Dans Dias";

  definition.variables = { stackboard_pat: PAT, stackboard_username: userName, stackboard_userinfo: userInfo };

  return await client.createDefinition(definition, currentProject.name);
}

export async function RunBuild(buildDefinitionId: number): Promise<Build> {
  await DevOps.ready();
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  const currentProject = await projectService.getProject();

  const build = {} as Build;
  build.definition = await client.getDefinition(
    currentProject.name,
    buildDefinitionId
  );

  if (build.definition) {
    return await client.queueBuild(build, currentProject.name);
  }

  throw new Error(`Can't find build definition with id - ${buildDefinitionId}`);
}
