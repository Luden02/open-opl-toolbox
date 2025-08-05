import React, { Component } from "react";

import "./LibraryPageStyle.css";
import { Table } from "@chakra-ui/react";

type Props = object;

type State = object;

class LibraryPageComponent extends Component<Props, State> {
  state = {};

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

  render() {
    return (
      <div className="container">
        <Table.ScrollArea borderWidth="1px" maxW="50%">
          <Table.Root size="sm" striped showColumnBorder stickyHeader>
            <Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader minW="360px">Name</Table.ColumnHeader>
                  <Table.ColumnHeader>GAME ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Type</Table.ColumnHeader>
                  <Table.ColumnHeader>Size</Table.ColumnHeader>
                  <Table.ColumnHeader>Disk Type</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.mockup.map((game, idx) => (
                  <Table.Row key={game.gameId} onClick={() => console.log(game.gameId)}>
                    <Table.Cell>{game.name}</Table.Cell>
                    <Table.Cell>{game.gameId}</Table.Cell>
                    <Table.Cell>{game.type}</Table.Cell>
                    <Table.Cell>{game.size}</Table.Cell>
                    <Table.Cell>{game.diskType}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Caption>
          </Table.Root>
        </Table.ScrollArea>
      </div>
    );
  }
}

export default LibraryPageComponent;
