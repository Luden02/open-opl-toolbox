import { FileSystemItem, GameObject, Library } from "../types";
import { writeLogLine } from "./log.service";
import { SystemService } from "./system.service";

export class GameLibraryService {
  private static instance: GameLibraryService;
  private readonly systemService = SystemService.getInstance();

  private readonly subscribers: ((state: Library) => void)[] = [];

  private state: Library = {
    loadedDirectory: null,
    cdGamesList: [],
    dvdGamesList: [],
    selectedGame: null,
  };

  public static getInstance(): GameLibraryService {
    if (!GameLibraryService.instance) {
      GameLibraryService.instance = new GameLibraryService();
    }
    return GameLibraryService.instance;
  }

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

  unsubscribe(callback: (state: Library) => void) {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  chooseDirectory(): Promise<void> {
    writeLogLine("Asking OS to open folder chooser...", "verbose", false);
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
      this.systemService.toggleIsLoading(false);
    });
  }

  async loadLibraryFromDirectory(directory: string): Promise<void> {
    writeLogLine(`Resetting LibraryData to clear state...`, "verbose", false);

    this.state = {
      ...this.state,
      loadedDirectory: directory,
      cdGamesList: [],
      dvdGamesList: [],
      selectedGame: null,
    };

    writeLogLine(`LibraryData cleared.`, "verbose", false);

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
      this.systemService.toggleIsLoading(false);
    }
  }

  private async loadGamesFromDir(
    path: string,
    type: "CD" | "DVD"
  ): Promise<GameObject[]> {
    try {
      writeLogLine(`Reading directory ${path}, waiting...`, "verbose", false);
      const result = await window.electronAPI.readDirectory(path);
      writeLogLine(`Correctly loaded from: ${path}`, "verbose", false);
      writeLogLine(`Passing files to GameObjectParser...`, "verbose", false);
      return this.parseToGameObject(result.files, type);
    } catch (error) {
      writeLogLine(
        `Error reading ${type} directory: ${error.message}`,
        "normal",
        true
      );
      this.systemService.toggleIsLoading(false);
      return [];
    }
  }

  private async parseToGameObject(
    files: FileSystemItem[],
    gameType: "CD" | "DVD"
  ) {
    writeLogLine(
      "Parsing for type: " + gameType + " started...",
      "verbose",
      false
    );
    const toSend: GameObject[] = [];
    writeLogLine(
      `Filtering for .iso files, ignoring the rest...`,
      "verbose",
      false
    );
    files
      .filter(
        (file) => file.isDirectory === false && file.name.endsWith(".iso")
      )
      .forEach((iso: FileSystemItem) => {
        writeLogLine(`Calculating size for ${iso.name}...`, "verbose", false);
        const formatSize = (bytes: number): string => {
          if (bytes >= 1024 * 1024 * 1024) {
            return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
          } else if (bytes >= 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(2) + " MB";
          } else {
            return bytes + " bytes";
          }
        };

        writeLogLine(
          `${iso.name} - ${formatSize(iso.size || 0)}`,
          "verbose",
          false
        );

        const gameObj: GameObject = {
          name: iso.name
            .replace(/^[A-Z]{4}_\d+\.\d+\./, "")
            .replace(".iso", ""),
          gameId: RegExp(/^([A-Z]{4}_\d+\.\d+)/).exec(iso.name)?.[1] || "",
          type: "PS2",
          size: formatSize(iso.size || 0),
          diskType: gameType,
        };

        window.electronAPI.get3DCoverArt(gameObj.gameId).then((res) => {
          writeLogLine(
            `Dinamically fetched remote art for display (${gameObj.gameId})`,
            "verbose",
            false
          );
          gameObj.art = { coverart3d: res.data };
        });

        writeLogLine(
          "Correctly parsed game: " +
            JSON.stringify({ ...gameObj, art: "..." }),
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

    this.systemService.toggleIsLoading(false);

    return toSend;
  }

  public onGameSelection = (game: GameObject) => {
    writeLogLine(
      `Game has been selected from library: ${JSON.stringify({ ...game, art: undefined })}`,
      "verbose",
      false
    );
    this.state.selectedGame = game;
    this.notifySubscribers();
  };

  onNewGameDetailsSave = (filePath: string, name: string, gameId: string) => {
    this.systemService.toggleIsLoading(true);
    writeLogLine(
      `<onNewGameDetailsSave> Renaming [${filePath}] ---> [${gameId} - ${name}]`,
      "normal",
      false
    );
    return window.electronAPI.renameGame(filePath, name, gameId).then(() => {
      if (this.state.loadedDirectory) {
        this.loadLibraryFromDirectory(this.state.loadedDirectory);
      }
    });
  };
}
