import { dialog } from "electron";
import * as fs from "fs/promises";
import path from "path";

export async function openAskDirectory(options: any) {
  const defaultOptions = {
    properties: ["openDirectory"],
    title: "Select OPL Root Directory",
  };

  const result = await dialog.showOpenDialog({
    ...defaultOptions,
    ...options,
  });

  return result;
}

export async function getGamesFiles(dirPath: string) {
  try {
    const [items_cd, items_dvd] = await Promise.all([
      fs.readdir(path.join(dirPath, "CD"), { withFileTypes: true }),
      fs.readdir(path.join(dirPath, "DVD"), { withFileTypes: true }),
    ]);
    // Only include files, skip directories
    const items = [
      ...items_cd.map((item) =>
        Object.assign(item, { parentDir: dirPath + "/CD" })
      ),
      ...items_dvd.map((item) =>
        Object.assign(item, { parentDir: dirPath + "/DVD" })
      ),
    ].filter(
      (item) =>
        item.isFile() &&
        !item.name.startsWith(".") &&
        (item.name.endsWith(".iso") || item.name.endsWith(".zso"))
    );

    const files = [];

    for (const item of items) {
      const stats = await fs.stat(item.parentDir + "/" + item.name);

      const itemInfo = {
        extension: path.extname(item.name),
        name: path.parse(item.name).name,
        parentPath: item.parentDir,
        path: item.parentDir + "/" + item.name,
        stats,
      };

      files.push(itemInfo);
    }
    return { success: true, data: files };
  } catch (err) {
    return { success: false, message: err };
  }
}
