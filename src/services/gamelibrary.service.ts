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
    writeLogLine(
      "<chooseDirectory> Asking OS to open folder chooser...",
      "verbose",
      false
    );
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
        "<chooseDirectory> Directory prompt has been canceled by user.",
        "verbose",
        false
      );
      this.systemService.toggleIsLoading(false);
    });
  }

  async loadLibraryFromDirectory(directory: string): Promise<void> {
    writeLogLine(
      `<loadLibraryFromDirectory> Resetting LibraryData to clear state...`,
      "verbose",
      false
    );

    this.state = {
      ...this.state,
      loadedDirectory: directory,
      cdGamesList: [],
      dvdGamesList: [],
      selectedGame: null,
    };

    writeLogLine(
      `<loadLibraryFromDirectory> LibraryData cleared.`,
      "verbose",
      false
    );

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
      writeLogLine(
        `<loadGamesFromDir> Reading directory ${path}, waiting...`,
        "verbose",
        false
      );
      const result = await window.electronAPI.readDirectory(path);
      writeLogLine(
        `<loadGamesFromDir> Correctly loaded from: ${path}`,
        "verbose",
        false
      );
      writeLogLine(
        `<loadGamesFromDir> Passing files to GameObjectParser...`,
        "verbose",
        false
      );
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
      "<parseToGameObject> Parsing for type: " + gameType + " started...",
      "verbose",
      false
    );
    writeLogLine(
      `<parseToGameObject> Filtering for .iso files, ignoring the rest...`,
      "verbose",
      false
    );

    const isoFiles = files.filter(
      (file) => file.isDirectory === false && file.name.endsWith(".iso")
    );

    const formatSize = (bytes: number): string => {
      if (bytes >= 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
      } else if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
      } else {
        return bytes + " bytes";
      }
    };

    const toSend: GameObject[] = [];

    for (const iso of isoFiles) {
      writeLogLine(
        `<parseToGameObject> Calculating size for ${iso.name}...`,
        "verbose",
        false
      );

      writeLogLine(
        `${iso.name} - ${formatSize(iso.size || 0)}`,
        "verbose",
        false
      );

      const gameObj: GameObject = {
        name: iso.name.replace(/^[A-Z]{4}_\d+\.\d+\./, "").replace(".iso", ""),
        gameId:
          RegExp(/^([A-Z]{4}_\d+\.\d+)/).exec(iso.name)?.[1] ||
          "invalid file name!",
        isValid: !!RegExp(/^([A-Z]{4}_\d+\.\d+)/).exec(iso.name)?.[1],
        type: "PS2",
        size: formatSize(iso.size || 0),
        diskType: gameType,
      };

      if (gameObj.gameId === "invalid file name!") {
        writeLogLine(
          `Gamefile .iso is named incorrectly! (${gameObj.name}) abort art fetch!`,
          "normal",
          true
        );
      } else {
        gameObj.art = {
          coverart3d: "",
          front_cover: false,
          back_cover: false,
          disc_icon: false,
          spine_cover: false,
          screen_1: false,
          screen_2: false,
          background: false,
        };
        await Promise.all([
          window.electronAPI.get3DCoverArt(gameObj.gameId).then((res) => {
            writeLogLine(
              `<parseToGameObject> Dinamically fetched remote art for display (${gameObj.gameId})`,
              "verbose",
              false
            );
            gameObj.art.coverart3d = res.data;
          }),
          window.electronAPI
            .importGameArt(gameObj.gameId, `${this.state.loadedDirectory}/ART`)
            .then((res: any) => {
              writeLogLine(
                `Fetching already available game art for  (${gameObj.gameId})`,
                "normal",
                false
              );

              if (res.success) {
                res.files.forEach((file: any) => {
                  switch (file.type) {
                    case "COV": {
                      gameObj.art.front_cover = true;
                      break;
                    }
                    case "COV2": {
                      gameObj.art.back_cover = true;
                      break;
                    }
                    case "ICO": {
                      gameObj.art.disc_icon = true;
                      break;
                    }
                    case "LAB": {
                      gameObj.art.spine_cover = true;
                      break;
                    }
                    case "SCR": {
                      gameObj.art.screen_1 = true;
                      break;
                    }
                    case "SCR_00": {
                      gameObj.art.screen_1 = true;
                      break;
                    }
                    case "SCR_01": {
                      gameObj.art.screen_2 = true;
                      break;
                    }
                    case "BG": {
                      gameObj.art.background = true;
                      break;
                    }
                  }
                });
              }
            }),
        ]);
      }

      toSend.push(gameObj);
    }

    writeLogLine(
      "Parsed " + toSend.length + " " + gameType + " games",
      "normal",
      false
    );

    this.systemService.toggleIsLoading(false);

    return toSend;
  }

  public onGameSelection = (game: GameObject, isValid: boolean) => {
    writeLogLine(
      `Game has been selected from library: ${JSON.stringify({ ...game, art: undefined })}`,
      "verbose",
      false
    );
    this.state.selectedGame = game;
    this.notifySubscribers();
  };

  public onNewGameDetailsSave = (
    filePath: string,
    name: string,
    gameId: string,
    namingFromInvalid: boolean
  ) => {
    this.systemService.toggleIsLoading(true);
    if (namingFromInvalid) {
      writeLogLine(
        `<onNewGameDetailsSave> Renaming [${filePath}] ---> [${name}]`,
        "normal",
        false
      );
      return window.electronAPI
        .renameGame(filePath, name, undefined)
        .then(() => {
          if (this.state.loadedDirectory) {
            this.loadLibraryFromDirectory(this.state.loadedDirectory);
          }
        });
    }
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

  public downloadAllGameArt(gameId: string, dirpath: string) {
    this.systemService.toggleIsLoading(true);
    window.electronAPI
      .downloadGameArt(gameId, `${dirpath}/ART`)
      .then((res: any) => {
        this.systemService.toggleIsLoading(false);
        if (this.state.loadedDirectory) {
          const selectedGame = this.state.selectedGame;
          this.loadLibraryFromDirectory(this.state.loadedDirectory);
          this.onGameSelection(selectedGame, true);
        }
      });
  }
}
