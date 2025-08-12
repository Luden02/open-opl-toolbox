import React, { Component } from "react";

import "./LibraryPageStyle.css";
import { Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { ElectronAPI, Library } from "../../types";
import { GameLibraryService } from "../../services/gamelibrary.service";
import GameTableComponent from "./components/GameTable/GameTableComponent";
import { SystemService } from "../../services/system.service";
import GameDetailsComponent from "./components/GameDetailsComponent";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type Props = object;

type State = {
  library: Library;
  isLoading: boolean;
};
class LibraryPageComponent extends Component<Props, State> {
  private readonly gameLibraryService = GameLibraryService.getInstance();
  private readonly systemService = SystemService.getInstance();
  constructor(props: Props) {
    super(props);

    this.state = {
      library: {
        loadedDirectory: undefined,
        cdGamesList: [],
        dvdGamesList: [],
        selectedGame: undefined,
      },
      isLoading: false,
    };
  }

  componentDidMount() {
    this.gameLibraryService.subscribe((library: Library) => {
      this.setState({ library });
    });

    this.systemService.subscribe((state) => {
      this.setState({ isLoading: state.isLoading });
    });
  }

  componentWillUnmount() {
    this.gameLibraryService.unsubscribe((library: Library) => {
      this.setState({ library });
    });

    this.systemService.unsubscribe((state) => {
      this.setState({ isLoading: state.isLoading });
    });
  }

  render() {
    return (
      <div className="library-page">
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          gap={"12px"}
          height={"calc(100% - 60px)"}
        >
          <GridItem colSpan={9} h={"100%"}>
            <GameTableComponent
              library={this.state.library}
              onGameRowClick={this.gameLibraryService.onGameSelection}
            />
          </GridItem>
          <GridItem
            colSpan={3}
            h={"100%"}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
          >
            <GameDetailsComponent
              selectedGame={this.state.library.selectedGame}
              isLoading={this.state.isLoading}
              onDetailsSave={(name: string, gameId: string) =>
                this.gameLibraryService.onNewGameDetailsSave(
                  `${this.state.library.loadedDirectory}/${this.state.library.selectedGame.diskType}/${this.state.library.selectedGame.gameId}.${this.state.library.selectedGame.name}.iso`,
                  name,
                  gameId
                )
              }
            />
          </GridItem>
        </Grid>
        <div className="footer-bar">
          <Button
            onClick={() => this.gameLibraryService.chooseDirectory()}
            disabled={this.state.isLoading}
            loading={this.state.isLoading}
          >
            Load Directory
          </Button>
          <Text className="footerText">
            Current directory: {this.state.library.loadedDirectory || "None"}
          </Text>
          <Text className="footerText" marginLeft="auto">
            Games:{" "}
            {this.state.library.cdGamesList.length +
              this.state.library.dvdGamesList.length}{" "}
            | Total Size:{" "}
            {(() => {
              const allGames = [
                ...this.state.library.cdGamesList,
                ...this.state.library.dvdGamesList,
              ];
              const totalBytes = allGames.reduce((sum, game) => {
                const sizeStr = game.size;
                let bytes = 0;
                if (sizeStr.includes("GB")) {
                  bytes = parseFloat(sizeStr) * 1024 * 1024 * 1024;
                } else if (sizeStr.includes("MB")) {
                  bytes = parseFloat(sizeStr) * 1024 * 1024;
                } else {
                  bytes = parseFloat(sizeStr);
                }
                return sum + bytes;
              }, 0);
              return (totalBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
            })()}
          </Text>
        </div>
      </div>
    );
  }
}

export default LibraryPageComponent;
