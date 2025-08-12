import { Container, Table } from "@chakra-ui/react";
import { GameObject, Library } from "../../../../types";
import React from "react";

import "./GameTableStyle.css";

interface GameTableComponentProps {
  library: Library;
  onGameRowClick: (game: GameObject) => void;
}

const GameTableComponent: React.FC<GameTableComponentProps> = ({
  library,
  onGameRowClick,
}) => {
  return (
    <Container padding={0} margin={0} h={"100%"}>
      <Table.ScrollArea borderWidth="1px" h={"100%"} overflowX="auto">
        <Table.Root
          size="sm"
          showColumnBorder
          stickyHeader
          interactive
          minW="800px"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader minW="200px">Name</Table.ColumnHeader>
              <Table.ColumnHeader minW="120px">GAME ID</Table.ColumnHeader>
              <Table.ColumnHeader minW="100px">Type</Table.ColumnHeader>
              <Table.ColumnHeader minW="100px">Size</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Front Cover</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Back Cover</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Disc Icon</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Spine Cover</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Screen 1</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Screen 2</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Background</Table.ColumnHeader>
              <Table.ColumnHeader minW="80px">Logo</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {[...library.cdGamesList, ...library.dvdGamesList].map((game) => (
              <Table.Row
                className={`game-row${library.selectedGame?.gameId === game.gameId ? " active" : ""}`}
                key={game.gameId}
                onClick={() => onGameRowClick(game)}
              >
                <Table.Cell
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
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
                <Table.Cell>NO</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Container>
  );
};

export default GameTableComponent;
