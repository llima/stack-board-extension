import tl = require("azure-pipelines-task-lib/task");
import path = require("path");
import fs = require("fs");

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

function transformToRegex(values: string[]): RegExp[] {
  const regex = [];

  for (let val of values) {
    regex.push(new RegExp(`${val}`, "g"));
  }

  return regex;
}

function transformTo(values: string[]): string[] {
  const to = [];

  for (let val of values) {
    to.push(val);
  }

  return to;
}

function getFirstNode(obj: any, path: string): any {
  let nodes: any[] = [];
  path.split(".").reduce(function (prev, curr) {
    let item = prev ? prev[curr] : null;
    nodes.push(JSON.stringify(item));

    return item;
  }, obj);

  return nodes.length > 0 ? nodes[0] : null;
}

function setFirstNode(obj: any, path: string, value: any): any {
  let nodes: any[] = [];
  let paths = path.split(".");
  let key = paths[paths.length - 1];

  paths.reduce(function (prev, curr) {
    let item = prev ? prev[curr] : null;
    if (item != null) {
      if (curr == key) {        
        prev[curr] = value;
      }
    }
    nodes.push(JSON.stringify(item));
    return item;
  }, obj);

  return nodes.length > 0 ? nodes[0] : null;
}

async function main(): Promise<void> {
  try {
    tl.setResourcePath(path.join(__dirname, "task.json"));

    const folderPath = tl.getPathInput("folderPath", true) ?? "";
    const fileType = tl.getPathInput("fileType", true) ?? "yaml";
    const targetFiles = tl.getPathInput("targetFiles", true) ?? "";
    
    //const workingDirectory = tl.getVariable("System.DefaultWorkingDirectory");
    
    const variables = [
      { key: "", value: "" },      
    ];
    const keys = variables.map((k) => k.key);
    const values = variables.map((k) => k.value);
    
    console.log("Replace files...", targetFiles);

    for (let file of targetFiles) {
      if (fileType == "yaml") {
        const options: ReplaceInFileConfig = {
          files: folderPath + "/" + file,
          from: transformToRegex(keys),
          to: transformTo(values),
        };
  
        await replaceContent(options);
      } else {
        const content = fs.readFileSync(folderPath + "/" + file, "utf8");
        const app = JSON.parse(content);
        
        let jsonfy = JSON.stringify(content.replace(/(?:\r\n|\r|\n|\s)/g, ""));        

        for (let variable of variables) {
          const nodeTo = setFirstNode(app, variable.key, variable.value);
          const nodeFrom = getFirstNode(app, variable.key);
          
          if (nodeTo != undefined && nodeFrom != undefined) {
            const from = JSON.stringify(nodeTo).replace(/(^\"+|\"+$)/gm, "");
            const to = JSON.stringify(nodeFrom).replace(/(^\"+|\"+$)/gm, "");
  
            jsonfy = jsonfy.replace(from, to);
          }
        }

        fs.writeFileSync(folderPath + "/" + file, JSON.parse(jsonfy));
      }      
    }

    tl.setResult(tl.TaskResult.Succeeded, "Task completed!");
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err);
  }
}

main().catch((err) => {
  tl.setResult(tl.TaskResult.Failed, err);
});
