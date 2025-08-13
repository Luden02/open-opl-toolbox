import { Container, Table } from "@chakra-ui/react";
import { GameObject, Library } from "../../../../types";
import React from "react";

import "./GameTableStyle.css";

interface GameTableComponentProps {
  library: Library;
  onGameRowClick: (game: GameObject, isValid: boolean) => void;
}

const GameTableComponent: React.FC<GameTableComponentProps> = ({
  library,
  onGameRowClick,
}) => {
  return (
    <Container padding={0} margin={0} maxW={"100%"} h={"100%"} w={"100%"}>
      <Table.ScrollArea
        borderWidth="1px"
        h={"100%"}
        w={"100%"}
        overflowX="auto"
      >
        <Table.Root
          size="sm"
          w={"100%"}
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
                className={`game-row${
                  game.gameId === "invalid file name!"
                    ? library.selectedGame?.name === game.name
                      ? " active"
                      : ""
                    : library.selectedGame?.gameId === game.gameId
                      ? " active"
                      : ""
                }${game.gameId === "invalid file name!" ? " invalid" : ""}`}
                key={game.gameId}
                onClick={() =>
                  game.gameId !== "invalid file name!"
                    ? onGameRowClick(game, true)
                    : onGameRowClick(game, false)
                }
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
                <Table.Cell>{game?.art?.front_cover ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.back_cover ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.disc_icon ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.spine_cover ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.screen_1 ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.screen_2 ? "YES" : "NO"}</Table.Cell>
                <Table.Cell>{game?.art?.logo ? "YES" : "NO"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Container>
  );
};

export default GameTableComponent;
