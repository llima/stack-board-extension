import { Services } from "./services";
import { SettingsService, SettingsServiceId } from "./settings";
import { TemplateService, TemplateServiceId } from "./template";

Services.registerService(SettingsServiceId, SettingsService);
Services.registerService(TemplateServiceId, TemplateService);
