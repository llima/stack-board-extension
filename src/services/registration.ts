import { Services } from "./services";
import { SettingsService, SettingsServiceId } from "./settings";

// Mock services
Services.registerService(SettingsServiceId, SettingsService);
