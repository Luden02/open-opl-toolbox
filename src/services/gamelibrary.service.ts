import { FileSystemItem, GameObject, Library } from "../types";
import { writeLogLine } from "./log.service";
import { SystemService } from "./system.service";

export class GameLibraryService {
  private systemService = new SystemService();

  private subscribers: ((state: Library) => void)[] = [];

  private state: Library = {
    loadedDirectory: null,
    cdGamesList: [],
    dvdGamesList: [],
    selectedGame: null,
  };

  subscribe(callback: (state: Library) => void) {
    this.subscribers.push(callback);
    callback(this.state);

    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  chooseDirectory(): Promise<void> {
    this.systemService.toggleIsLoading(true);
    return window.electronAPI.showOpenDialog().then((res) => {
      if (!res.canceled) {
        writeLogLine(
          "Directory has been chosen: " + res.filePaths[0],
          "normal",
          false
        );
        return this.loadLibraryFromDirectory(res.filePaths[0]);
      }
      writeLogLine(
        "Directory prompt has been canceled by user.",
        "verbose",
        false
      );
    });
  }

  async loadLibraryFromDirectory(directory: string): Promise<void> {
    writeLogLine(`Resetting LibraryData to clear state.`, "verbose", false);

    this.state = {
      ...this.state,
      loadedDirectory: directory,
      cdGamesList: [],
      dvdGamesList: [],
      selectedGame: null,
    };

    this.notifySubscribers();

    try {
      writeLogLine(`Loading library from: ${directory}`, "normal", false);
      const [cdGames, dvdGames] = await Promise.all([
        this.loadGamesFromDir(`${directory}/CD`, "CD"),
        this.loadGamesFromDir(`${directory}/DVD`, "DVD"),
      ]);

      this.state.cdGamesList = cdGames;
      this.state.dvdGamesList = dvdGames;
      this.notifySubscribers();
    } catch (error) {
      writeLogLine(`Failed to load library: ${error.message}`, "normal", true);
    }
  }

  private async loadGamesFromDir(
    path: string,
    type: "CD" | "DVD"
  ): Promise<GameObject[]> {
    try {
      const result = await window.electronAPI.readDirectory(path);
      writeLogLine(`Correctly loaded from: ${path}`, "verbose", false);
      return this.parseToGameObject(result.files, type);
    } catch (error) {
      writeLogLine(
        `Error reading ${type} directory: ${error.message}`,
        "normal",
        true
      );
      return [];
    }
  }

  private async parseToGameObject(
    files: FileSystemItem[],
    gameType: "CD" | "DVD"
  ) {
    writeLogLine(
      "Parsing for type: " + gameType + " started.",
      "verbose",
      false
    );
    const toSend: GameObject[] = [];
    files
      .filter(
        (file) => file.isDirectory === false && file.name.endsWith(".iso")
      )
      .forEach((iso: FileSystemItem) => {
        const formatSize = (bytes: number): string => {
          if (bytes >= 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
          } else if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + " MB";
          } else {
            return bytes + " bytes";
          }
        };

        const gameObj: GameObject = {
          name: iso.name
            .replace(/^[A-Z]{4}_\d+\.\d+\./, "")
            .replace(".iso", ""),
          gameId: RegExp(/^([A-Z]{4}_\d+\.\d+)/).exec(iso.name)?.[1] || "",
          type: "PS2",
          size: formatSize(iso.size || 0),
          diskType: gameType,
        };

        writeLogLine(
          "Parsed game: " + JSON.stringify(gameObj),
          "verbose",
          false
        );
        toSend.push(gameObj);
      });

    writeLogLine(
      "Parsed " + toSend.length + " " + gameType + " games",
      "normal",
      false
    );

    return toSend;
  }
}
