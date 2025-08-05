import React, { Component } from "react";

import "./LibraryPageStyle.css";
import { Button, Table, Text } from "@chakra-ui/react";
import { ElectronAPI, FileSystemItem } from "../../utils/electron-api";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type Props = object;

type State = {
  loadedDirectory: string;
  cd_games: gameObject[];
  dvd_games: gameObject[];
};

type gameObject = {
  name: string;
  gameId: string;
  type: string;
  size: string;
  diskType: string;
};

class LibraryPageComponent extends Component<Props, State> {
  state: State = {
    loadedDirectory: undefined,
    cd_games: [],
    dvd_games: [],
  };

  constructor(props: Props) {
    super(props);
  }

  onLoadDirectoryClick = () => {
    window.electronAPI.showOpenDialog().then((res) => {
      this.setState({ loadedDirectory: res.filePaths[0] }, () => {
        window.electronAPI
          .readDirectory(this.state.loadedDirectory + "/CD")
          .then((res) => this.mapFilesToGameObjects(res.files, "CD"));
        window.electronAPI
          .readDirectory(this.state.loadedDirectory + "/DVD")
          .then((res) => this.mapFilesToGameObjects(res.files, "DVD"));
      });
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
            .replace(/^[A-Z]{4}-\d+\.\d+\./, "")
            .replace(".iso", ""),
          gameId: RegExp(/^([A-Z]{4}-\d+\.\d+)/).exec(iso.name)?.[1] || "",
          type: "PS2",
          size: formatSize(iso.size || 0),
          diskType: gameType,
        };

        toSend.push(gameObj);
      });

    this.setState({ cd_games: toSend });
  };

  render() {
    return (
      <div className="container">
        <Table.ScrollArea borderWidth="1px" maxW="50%" minH={620}>
          <Table.Root size="sm" striped showColumnBorder stickyHeader>
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
              {[...this.state.cd_games, ...this.state.dvd_games].map((game) => (
                <Table.Row
                  key={game.gameId}
                  onClick={() => console.log(game.gameId)}
                >
                  <Table.Cell>{game.name}</Table.Cell>
                  <Table.Cell>{game.gameId}</Table.Cell>
                  <Table.Cell>{game.type}</Table.Cell>
                  <Table.Cell>{game.size}</Table.Cell>
                  <Table.Cell>{game.diskType}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <div className="footer-bar">
          <Button onClick={this.onLoadDirectoryClick}>Load Directory</Button>
          <Text className="directory">
            Current directory: {this.state.loadedDirectory || "None"}
          </Text>
        </div>
      </div>
    );
  }
}

export default LibraryPageComponent;
