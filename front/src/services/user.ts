import * as DevOps from "azure-devops-extension-sdk";
import { IProjectPageService } from "azure-devops-extension-api";

import { getClient } from "azure-devops-extension-api";
import { ProfileRestClient } from "azure-devops-extension-api/Profile";
import { IUser } from "../model/user";

const client: ProfileRestClient = getClient(ProfileRestClient);

export async function GetCurrentUserAsync(): Promise<void> {
  var user = await client.getProfile("me", true, true);
  console.log(user);
}
