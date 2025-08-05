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
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { ElectronAPI, FileSystemItem } from "../../utils/electron-api";

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
  state: State = {
    loadedDirectory: undefined,
    cd_games: [],
    dvd_games: [],
    isLoading: false,
    currentGame: undefined,
  };

  constructor(props: Props) {
    super(props);
  }

  onLoadDirectoryClick = () => {
    this.setState({ isLoading: true });
    window.electronAPI
      .showOpenDialog()
      .then((res) => {
        this.setState({ loadedDirectory: res.filePaths[0] }, () => {
          if (this.state.loadedDirectory) {
            const promises = [
              window.electronAPI
                .readDirectory(this.state.loadedDirectory + "/CD")
                .then((res) => this.mapFilesToGameObjects(res.files, "CD")),
              window.electronAPI
                .readDirectory(this.state.loadedDirectory + "/DVD")
                .then((res) => this.mapFilesToGameObjects(res.files, "DVD")),
            ];

            Promise.all(promises).finally(() => {
              this.setState({ isLoading: false });
            });
          } else {
            this.setState({ isLoading: false });
          }
        });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  };

  mapFilesToGameObjects = (files: FileSystemItem[], gameType: "CD" | "DVD") => {
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

        toSend.push(gameObj);
      });

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
    this.setState({ currentGame: game }, () => {
      window.electronAPI
        .get3DCoverArt(this.state.currentGame.gameId)
        .then((res: any) => {
          console.log(res.data);
          this.setState({
            currentGame: {
              ...this.state.currentGame,
              "3dcoverart": res.data,
            },
          });
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
                        className="game-row"
                        key={game.gameId}
                        onClick={() => this.onGameClick(game)}
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
              <GridItem colSpan={9}>test</GridItem>
              <GridItem colSpan={3}>
                <Flex justifyContent={"end"} height={"100%"} alignItems={"end"}>
                  <div>
                    <GridItem colSpan={6} marginRight={"12px"}>
                      {this.state?.currentGame?.["3dcoverart"] && (
                        <Image
                          height={"300px"}
                          src={this.state.currentGame["3dcoverart"]}
                        ></Image>
                      )}
                    </GridItem>
                  </div>
                </Flex>
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
