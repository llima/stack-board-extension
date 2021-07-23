import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require("fs");
import shell = require("shelljs");

import {
  ReplaceInFileConfig,
  replaceInFileSync,
  ReplaceResult,
} from "replace-in-file";

async function replaceContent(
  options: ReplaceInFileConfig
): Promise<ReplaceResult[]> {
  try {
    return replaceInFileSync(options);
  } catch (error) {
    throw error;
  }
}

async function renameFiles(
  folder: string,
  from: string,
  to: string
): Promise<void> {
  var files = fs.readdirSync(folder),
    f: number,
    fileName: string,
    path: string,
    newPath: string,
    file: any;

  for (f = 0; f < files.length; f += 1) {
    fileName = files[f];
    path = folder + "/" + fileName;
    file = fs.statSync(path);
    newPath = folder + "/" + replaceTo(fileName, from, to);

    fs.renameSync(path, newPath);
    if (file.isDirectory()) {
      await renameFiles(newPath, from, to);
    }
  }
}

function replaceTo(text: string, from: string, to: string): string {
  return text.replace(from, to);
}

function transformToRegex(value: string, includeUpperCase?: boolean): RegExp[] {
  const values = [];
  values.push(new RegExp(`${value}`, "g"));

  if (includeUpperCase) {
    values.push(new RegExp(`${value.toUpperCase()}`, "g"));
  }

  return values;
}

function transformTo(value: string, includeUpperCase?: boolean): string[] {
  const values = [];
  values.push(value);

  if (includeUpperCase) {
    values.push(value);
  }

  return values;
}

function makeGitUrl(url: string, username: string, pass: string): string {
  const type = username && pass ? 1 : !username && pass ? 2 : 0;
  if (type == 0) {
    return url;
  }

  let repo = url.replace("https://", "");
  if (repo.includes("@")) {
    repo = repo.replace(repo.split("@")[0] + "@", "");
  }

  switch (type) {
    case 1:
      return `https://${username}:${pass}@${repo}`;
    case 2:
      return `https://${pass}@${repo}`;
    default:
      return "";
  }
}

async function main(): Promise<void> {
  try {
    tl.setResourcePath(path.join(__dirname, "task.json"));

    const sourceRepository = tl.getPathInput("sourceRepository", true) ?? "";
    const replaceFrom = tl.getPathInput("replaceFrom", true) ?? "";
    const replaceTo = tl.getPathInput("replaceTo", true) ?? "";

    const userinfo = tl.getVariable("stackboard_userinfo") ?? "|";
    const username = tl.getVariable("stackboard_username") ?? "";
    const PAT = tl.getVariable("stackboard_pat") ?? "";

    const workingDirectory = tl.getVariable("System.DefaultWorkingDirectory");

    const sourceGitUrl = makeGitUrl(sourceRepository, username, PAT);
    const sourceFolder = "STACKBOARD-REPOS-TEMPLATE";

    shell.exec(`git clone ${sourceGitUrl} ${sourceFolder}`);

    const options: ReplaceInFileConfig = {
      files: sourceFolder + "/**",
      from: transformToRegex(replaceFrom, true),
      to: transformTo(replaceTo, true),
    };

    console.log("Replace content...");
    await replaceContent(options);

    console.log("Rename files...");
    await renameFiles(sourceFolder, replaceFrom, replaceTo);

    console.log("Move folder and files to...", workingDirectory);

    shell.mv(`${sourceFolder}/*`, `${workingDirectory}`);
    const gitIgnore = shell.find(`${sourceFolder}/.gitignore`);
    if (gitIgnore.length > 0) {
      shell.mv(`${sourceFolder}/.gitignore`, `${workingDirectory}`);
    }
    shell.rm("-rf", sourceFolder);

    console.log("Apply git changes...");

    shell.exec(`git config user.email \"${userinfo.split("|")[0]}\"`);
    shell.exec(`git config user.name \"${userinfo.split("|")[1]}\"`);

    shell.exec("git add --all");
    shell.exec("git commit -m \"Initial template made with Stack Board Extensions!\"");
    shell.exec("git push origin develop --force");

    tl.setResult(tl.TaskResult.Succeeded, "Task completed!");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
}

main().catch((err) => {
  tl.setResult(tl.TaskResult.Failed, err);
});
