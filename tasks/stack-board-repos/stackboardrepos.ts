import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require("fs");

import simpleGit, { SimpleGit } from "simple-git";
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

function transformTo(
  value: string,
  useRegex?: boolean,
  includeUpperCase?: boolean
): string[] {
  const values = [];

  if (useRegex) {
    values.push(new RegExp(`${value}`, "g"));

    if (includeUpperCase) {
      values.push(new RegExp(`${value.toUpperCase()}`, "g"));
    }
  } else {
    values.push(value);

    if (includeUpperCase) {
      values.push(value);
    }
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

async function showFiles(folder: string): Promise<void> {
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

    if (file.isDirectory()) {
      console.log("Folder", fileName);
      await showFiles(path);
    } else {
      console.log("File", fileName);
    }
  }
}

async function main(): Promise<void> {
  try {
    tl.setResourcePath(path.join(__dirname, "task.json"));

    const sourceRepository: string = tl.getPathInput("sourceRepository", true);
    const replaceFrom: string = tl.getPathInput("replaceFrom", true);
    const replaceTo: string = tl.getPathInput("replaceTo", true);

    const username: string = tl.getVariable("UserName");
    const PAT: string = tl.getVariable("PAT");

    const sourceGitUrl = makeGitUrl(sourceRepository, username, PAT);
    const sourceFolder = "template";
    const sourceGit: SimpleGit = simpleGit();

    console.log("git clone template...");
    sourceGit.clone(sourceGitUrl, sourceFolder);

    const options: ReplaceInFileConfig = {
      files: sourceFolder + "/**",
      from: transformTo(replaceFrom, true, true),
      to: transformTo(replaceTo, false, true),
    };

    console.log("replace content...");
    await replaceContent(options);

    console.log("rename files...");
    await renameFiles(sourceFolder, replaceFrom, replaceTo);

    //console.log("apply changes...");
    //   git.add(".");
    //   git.commit("Initial template");
    //   git.push();

    await showFiles(__dirname);

    tl.setResult(tl.TaskResult.Succeeded, "Task completed!");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
}

main().catch((err) => {
  tl.setResult(tl.TaskResult.Failed, err);
});
