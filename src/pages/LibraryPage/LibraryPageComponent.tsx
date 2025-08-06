import React, { Component } from "react";

import "./LibraryPageStyle.css";
import {
  Button,
  Field,
  Flex,
  Grid,
  GridItem,
  Image,
  Input,
  Skeleton,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { ElectronAPI, FileSystemItem } from "../../utils/electron-api";
import { writeLogLine } from "../../services/log.service";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type gameObject = {
  name: string;
  gameId: string;
  type: string;
  size: string;
  diskType: string;
  "3dcoverart"?: string;
};

type Props = object;

type State = {
  loadedDirectory: string;
  cd_games: gameObject[];
  dvd_games: gameObject[];
  isLoading: boolean;
  currentGame: gameObject;
};
class LibraryPageComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loadedDirectory: undefined,
      cd_games: [],
      dvd_games: [],
      isLoading: false,
      currentGame: undefined,
    };
  }

  onLoadDirectoryClick = () => {
    this.setState({ isLoading: true });
    this.setState({
      loadedDirectory: undefined,
      cd_games: [],
      dvd_games: [],
      currentGame: undefined,
    });
    window.electronAPI
      .showOpenDialog()
      .then((res) => {
        if (!res.canceled) {
          writeLogLine(
            "Directory has been chosen: " + res.filePaths[0],
            "normal",
            false
          );
          this.setState({ loadedDirectory: res.filePaths[0] }, () => {
            if (this.state.loadedDirectory) {
              writeLogLine("Starting fetching of folders...", "verbose", false);
              writeLogLine("Looking into /CD", "verbose", false);
              writeLogLine("Looking into /DVD", "verbose", false);
              const promises = [
                window.electronAPI
                  .readDirectory(this.state.loadedDirectory + "/CD")
                  .then((res) => {
                    writeLogLine(
                      "Converting /CD files to internal game objects...",
                      "verbose",
                      false
                    );
                    this.mapFilesToGameObjects(res.files, "CD");
                  })
                  .catch((err) => {
                    writeLogLine(
                      "Error reading /CD directory: " + err.message,
                      "normal",
                      true
                    );
                  }),
                window.electronAPI
                  .readDirectory(this.state.loadedDirectory + "/DVD")
                  .then((res) => {
                    writeLogLine(
                      "Converting /DVD files to internal game objects...",
                      "verbose",
                      false
                    );
                    this.mapFilesToGameObjects(res.files, "DVD");
                  })
                  .catch((err) => {
                    writeLogLine(
                      "Error reading /DVD directory: " + err.message,
                      "normal",
                      true
                    );
                  }),
              ];

              Promise.all(promises).finally(() => {
                this.setState({ isLoading: false });
              });
            } else {
              this.setState({ isLoading: false });
            }
          });
        } else {
          writeLogLine(
            "Directory prompt has been canceled by user.",
            "verbose",
            false
          );
          this.setState({ isLoading: false });
        }
      })
      .catch(() => {
        writeLogLine(
          "There was a problem opening the file explorer popup.",
          "normal",
          true
        );
        this.setState({ isLoading: false });
      });
  };

  mapFilesToGameObjects = (files: FileSystemItem[], gameType: "CD" | "DVD") => {
    writeLogLine(
      "Parsing for type: " + gameType + " started.",
      "verbose",
      false
    );
    const toSend: gameObject[] = [];
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

        const gameObj: gameObject = {
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
    switch (gameType) {
      case "CD":
        this.setState({ cd_games: toSend });
        break;
      case "DVD":
        this.setState({ dvd_games: toSend });
        break;
    }
  };

  onGameClick = (game: gameObject) => {
    writeLogLine(
      "Clicked on: " + JSON.stringify(game) + " Loading data in infobox",
      "verbose",
      false
    );
    this.setState({ currentGame: game }, () => {
      window.electronAPI
        .get3DCoverArt(this.state.currentGame.gameId)
        .then((res: any) => {
          this.setState({
            currentGame: {
              ...this.state.currentGame,
              "3dcoverart": res.data,
            },
          });
        })
        .catch((err) => {
          writeLogLine(
            "Error loading 3D cover art for game " +
              this.state.currentGame.gameId +
              ": " +
              err.message,
            "normal",
            true
          );
        });
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="table-section">
            <Table.ScrollArea borderWidth="1px" minH={620}>
              <Table.Root size="sm" showColumnBorder stickyHeader interactive>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>GAME ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Size</Table.ColumnHeader>
                    <Table.ColumnHeader>Disk Type</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {[...this.state.cd_games, ...this.state.dvd_games].map(
                    (game) => (
                      <Table.Row
                        key={game.gameId}
                        onClick={() => this.onGameClick(game)}
                        className={
                          game.gameId === this.state.currentGame?.gameId
                            ? "game-row selected"
                            : "game-row"
                        }
                      >
                        <Table.Cell
                          maxW="31ch"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {game.name}
                        </Table.Cell>
                        <Table.Cell>{game.gameId}</Table.Cell>
                        <Table.Cell>{game.type}</Table.Cell>
                        <Table.Cell>{game.size}</Table.Cell>
                        <Table.Cell>{game.diskType}</Table.Cell>
                      </Table.Row>
                    )
                  )}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </div>
          <div className="info-section">
            <Grid gapY={4}>
              <GridItem colSpan={12}>
                <Field.Root>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Field.Label>Game Name</Field.Label>
                  <Input value={this.state?.currentGame?.name}></Input>
                </Field.Root>
              </GridItem>
              <GridItem colSpan={11}>
                <Field.Root>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Field.Label>GameID</Field.Label>
                  <Input value={this.state?.currentGame?.gameId}></Input>
                </Field.Root>
              </GridItem>
              <GridItem colSpan={1}>
                <Flex justifyContent={"end"} height={"100%"} alignItems={"end"}>
                  <div>
                    <Button disabled>Save Edited Title & GameID</Button>
                  </div>
                </Flex>
              </GridItem>
              <GridItem colSpan={8} height={"100%"}>
                <div className="actions-box">
                  <Grid>
                    <GridItem colSpan={12}>
                      <Button width={"100%"} disabled={!this.state.currentGame}>
                        Delete Game
                      </Button>
                    </GridItem>
                    <GridItem colSpan={12} marginTop={"64px"}>
                      <Button width={"100%"} disabled={!this.state.currentGame}>
                        Grab Remote Art
                      </Button>
                    </GridItem>
                    <GridItem colSpan={12} marginTop={"64px"}>
                      <Button width={"100%"} disabled={!this.state.currentGame}>
                        Remove All Art
                      </Button>
                    </GridItem>
                  </Grid>
                </div>
              </GridItem>
              <GridItem colSpan={1}></GridItem>
              <GridItem colSpan={3}>
                <Flex
                  justifyContent={"center"}
                  height={"324px"}
                  alignItems={"center"}
                  className="coverart-container"
                >
                  <div>
                    <GridItem colSpan={6}>
                      {this.state?.currentGame ? (
                        this.state.currentGame["3dcoverart"] ? (
                          <Image
                            height={"300px"}
                            src={this.state.currentGame["3dcoverart"]}
                          />
                        ) : (
                          <Stack height={"300px"}>
                            <Spinner marginTop={"150px"} />
                          </Stack>
                        )
                      ) : null}
                    </GridItem>
                  </div>
                </Flex>
              </GridItem>
              <GridItem colSpan={12} height={"116px"}>
                <div className="actions-box">
                  <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        CD Games
                      </Text>
                      <Text fontSize="lg">{this.state.cd_games.length}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        DVD Games
                      </Text>
                      <Text fontSize="lg">{this.state.dvd_games.length}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        Total Games
                      </Text>
                      <Text fontSize="lg">
                        {this.state.cd_games.length +
                          this.state.dvd_games.length}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        Total Size
                      </Text>
                      <Text fontSize="lg">
                        {(() => {
                          const allGames = [
                            ...this.state.cd_games,
                            ...this.state.dvd_games,
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

                          if (totalBytes >= 1024 * 1024 * 1024) {
                            return (
                              (totalBytes / (1024 * 1024 * 1024)).toFixed(2) +
                              " GB"
                            );
                          } else if (totalBytes >= 1024 * 1024) {
                            return (
                              (totalBytes / (1024 * 1024)).toFixed(2) + " MB"
                            );
                          } else {
                            return totalBytes + " bytes";
                          }
                        })()}
                      </Text>
                    </GridItem>
                  </Grid>
                </div>
              </GridItem>
            </Grid>
          </div>
        </div>
        <div className="footer-bar">
          <Button
            disabled={this.state.isLoading}
            loading={this.state.isLoading}
            onClick={this.onLoadDirectoryClick}
          >
            Load Directory
          </Button>
          <Text className="directory">
            Current directory: {this.state.loadedDirectory || "None"}
          </Text>
        </div>
      </div>
    );
  }
}

export default LibraryPageComponent;
