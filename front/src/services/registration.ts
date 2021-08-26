import { Services } from "./services";
import { TemplateService, TemplateServiceId } from "./template";
import { ProjectService, ProjectServiceId } from "./project";
import { ApiService, ApiServiceId } from "./api";
import { CodeService, CodeServiceId } from "./code";
import { SonarService, SonarServiceId } from "./sonar";

Services.registerService(TemplateServiceId, TemplateService);
Services.registerService(ProjectServiceId, ProjectService);
Services.registerService(ApiServiceId, ApiService);
Services.registerService(CodeServiceId, CodeService);
Services.registerService(SonarServiceId, SonarService);
