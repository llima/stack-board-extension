import { Services } from "./services";
import { TemplateService, TemplateServiceId } from "./template";
import { ProjectService, ProjectServiceId } from "./project";

Services.registerService(TemplateServiceId, TemplateService);
Services.registerService(ProjectServiceId, ProjectService);
