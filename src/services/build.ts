import * as DevOps from "azure-devops-extension-sdk";
import { IProjectPageService } from "azure-devops-extension-api";

import { getClient } from "azure-devops-extension-api";
import {
  AgentSpecification,
  BuildDefinition,
  BuildDefinitionStep,
  BuildRepository,
  BuildRestClient,
  DefinitionType,
  DesignerProcess,
  DesignerProcessTarget,
  Phase,  
  TaskDefinitionReference,
} from "azure-devops-extension-api/Build";

const client: BuildRestClient = getClient(BuildRestClient);

export interface BuildProcessYaml {
  type: number;
  yamlFilename: string;
}

export interface PhaseTargetScript {
  type: number;
  allowScriptsAuthAccessOption: boolean;
}

export async function CreateBuildDefinitionAsync(
  name: string,
  repositoryId: string,
  templateUrl: string
): Promise<BuildDefinition> {
  await DevOps.ready();
  const projectService = await DevOps.getService<IProjectPageService>(
    "ms.vss-tfs-web.tfs-page-data-service"
  );
  const currentProject = await projectService.getProject();

  const repository = {} as BuildRepository;
  repository.type = "TfsGit";
  repository.id = repositoryId;

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
  step.inputs = { sourceRepository: templateUrl };

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

  const definition = {} as BuildDefinition;
  definition.name = name;
  definition.type = DefinitionType.Build;
  definition.repository = repository;
  definition.process = designerProcess;

  return await client.createDefinition(definition, currentProject.name);
}
