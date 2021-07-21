import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require("fs");

import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
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

async function main(): Promise<void> {
  try {
    tl.setResourcePath(path.join(__dirname, "task.json"));

    const sourceRepository: string = tl.getPathInput("sourceRepository", true);
    const replaceFrom: string = tl.getPathInput("replaceFrom", true);
    const replaceTo: string = tl.getPathInput("replaceTo", true);

    const sourceFolder = "template";
    const git: SimpleGit = simpleGit();
  
    console.log("git clone template...");
    git.clone(sourceRepository, sourceFolder);
  
    const options: ReplaceInFileConfig = {
      files: sourceFolder + "/**",
      from: transformTo(replaceFrom, true, true),
      to: transformTo(replaceTo, false, true),
    };
  
    console.log("replace content...");
    await replaceContent(options);
  
    console.log("rename files...");
    await renameFiles(sourceFolder, replaceFrom, replaceTo);
  
    console.log("apply changes...");
    //   git.add(".");
    //   git.commit("Initial template");
    //   git.push();

    tl.setResult(tl.TaskResult.Succeeded, "Task completed!");

  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
}

main().catch((err) => {
  tl.setResult(tl.TaskResult.Failed, err);
});
