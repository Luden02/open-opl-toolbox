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
import { ElectronAPI, Library } from "../../types";
import { GameLibraryService } from "../../services/gamelibrary.service";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type Props = object;
class LibraryPageComponent extends Component<Props, Library> {
  private readonly gameLibraryService = new GameLibraryService();
  constructor(props: Props) {
    super(props);

    this.state = {
      loadedDirectory: undefined,
      cdGamesList: [],
      dvdGamesList: [],
      selectedGame: undefined,
    };
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="table-section">
            {/* <Table.ScrollArea borderWidth="1px" minH={620}>
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
                  {[...this.state.cdGamesList, ...this.state.dvdGamesList].map(
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
            </Table.ScrollArea> */}
          </div>
          <div className="info-section">
            <Grid gapY={4}>
              <GridItem colSpan={12}>
                <Field.Root>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Field.Label>Game Name</Field.Label>
                  <Input value={this.state?.selectedGame?.name}></Input>
                </Field.Root>
              </GridItem>
              <GridItem colSpan={11}>
                <Field.Root>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Field.Label>GameID</Field.Label>
                  <Input value={this.state?.selectedGame?.gameId}></Input>
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
                      <Button
                        width={"100%"}
                        disabled={!this.state.selectedGame}
                      >
                        Delete Game
                      </Button>
                    </GridItem>
                    <GridItem colSpan={12} marginTop={"64px"}>
                      <Button
                        width={"100%"}
                        disabled={!this.state.selectedGame}
                      >
                        Grab Remote Art
                      </Button>
                    </GridItem>
                    <GridItem colSpan={12} marginTop={"64px"}>
                      <Button
                        width={"100%"}
                        disabled={!this.state.selectedGame}
                      >
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
                      {this.state?.selectedGame ? (
                        this.state.selectedGame.art ? (
                          <Image
                            height={"300px"}
                            src={this.state.selectedGame?.art.coverart3d}
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
                      <Text fontSize="lg">{this.state.cdGamesList.length}</Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        DVD Games
                      </Text>
                      <Text fontSize="lg">
                        {this.state.dvdGamesList.length}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        Total Games
                      </Text>
                      <Text fontSize="lg">
                        {this.state.cdGamesList.length +
                          this.state.dvdGamesList.length}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text fontSize="sm" fontWeight="bold">
                        Total Size
                      </Text>
                      <Text fontSize="lg">
                        {(() => {
                          const allGames = [
                            ...this.state.cdGamesList,
                            ...this.state.dvdGamesList,
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
          <Button onClick={() => this.gameLibraryService.chooseDirectory()}>
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
