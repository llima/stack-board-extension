import { Services } from "./services";
import { TemplateService, TemplateServiceId } from "./template";
import { ProjectService, ProjectServiceId } from "./project";
import { ApiService, ApiServiceId } from "./api";

Services.registerService(TemplateServiceId, TemplateService);
Services.registerService(ProjectServiceId, ProjectService);
Services.registerService(ApiServiceId, ApiService);
