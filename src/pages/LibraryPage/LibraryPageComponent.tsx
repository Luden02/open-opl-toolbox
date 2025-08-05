import React, { Component } from "react";

import "./LibraryPageStyle.css";
import { Button, Table, Text } from "@chakra-ui/react";
import { ElectronAPI } from "../../utils/electron-api";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type Props = object;

type State = {
  loadedDirectory: string;
};

class LibraryPageComponent extends Component<Props, State> {
  state: State = {
    loadedDirectory: "/Volumes/MX4SIO",
  };

  mockup = [
    {
      name: "Grand Theft Auto: San Andreas",
      gameId: "SLUS_00000",
      type: "PS2",
      size: "4.2GB",
      diskType: "DVD",
    },
    {
      name: "God Of War",
      gameId: "SLUS_00002",
      type: "PS2",
      size: "145MB",
      diskType: "CD",
    },
  ];

  constructor() {
    super({});
  }

  onLoadDirectoryClick = () => {
        window.electronAPI.showOpenDialog().then((res) => this.setState({loadedDirectory: res.filePaths[0]}));
  }

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
                {this.mockup.map((game) => (
                  <Table.Row key={game.gameId} onClick={() => console.log(game.gameId)}>
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
          <Button onClick={this.onLoadDirectoryClick}>Load Directory
          </Button>
          <Text className="directory">Current directory: {this.state.loadedDirectory}</Text>
          </div>
      </div>
    );
  }
}

export default LibraryPageComponent;
