import { Services } from "./services";
import { SettingsService, SettingsServiceId } from "./settings";
import { ProjectService, ProjectServiceId } from "./project";

Services.registerService(SettingsServiceId, SettingsService);
Services.registerService(ProjectServiceId, ProjectService);
