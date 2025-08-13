import { Button, Field, Grid, GridItem, Image, Input } from "@chakra-ui/react";
import { GameObject } from "../../../types";
import React from "react";

interface GameDetailsComponentProps {
  selectedGame: GameObject;
  isLoading?: boolean;
  onDetailsSave: (
    name: string,
    gameId: string,
    namingFromInvalid: boolean
  ) => void;
  onDownloadArt: (gameId: string) => void;
}

const GameDetailsComponent: React.FC<GameDetailsComponentProps> = ({
  selectedGame,
  isLoading = false,
  onDetailsSave,
  onDownloadArt,
}) => {
  const [newGameName, setNewGameName] = React.useState(
    selectedGame?.name || ""
  );
  const [newGameId, setNewGameId] = React.useState(selectedGame?.gameId || "");

  React.useEffect(() => {
    setNewGameName(selectedGame?.name || "");
    setNewGameId(selectedGame?.gameId || "");
  }, [selectedGame]);

  return (
    <div style={{ height: "100%" }}>
      <Grid
        templateColumns={"repeat(12, 1fr)"}
        templateRows={"1fr auto auto auto auto auto auto"}
        gap={"12px"}
        height={"100%"}
      >
        <GridItem
          id="game-box-art"
          colSpan={12}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image
            maxHeight="40vh"
            maxWidth="90%"
            height="auto"
            objectFit="contain"
            src={selectedGame?.art?.coverart3d}
          />
        </GridItem>
        <GridItem colSpan={12}>
          <Field.Root>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Field.Label>Game Name</Field.Label>
            <Input
              placeholder=""
              variant="subtle"
              value={newGameName}
              onChange={($event) => setNewGameName($event.target.value)}
            />
          </Field.Root>
        </GridItem>
        <GridItem colSpan={6}>
          <Field.Root>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Field.Label>GameID</Field.Label>
            <Input
              placeholder=""
              variant="subtle"
              value={newGameId}
              disabled={!selectedGame?.isValid}
              onChange={($event) => setNewGameId($event.target.value)}
            />
          </Field.Root>
        </GridItem>
        <GridItem
          colSpan={6}
          display={"flex"}
          alignItems={"end"}
          justifyContent={"center"}
        >
          <Button
            w={"100%"}
            disabled={!selectedGame}
            loading={isLoading}
            onClick={() => {
              onDetailsSave(newGameName, newGameId, !selectedGame.isValid);
            }}
          >
            Save Name & ID
          </Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button
            w={"100%"}
            disabled={!selectedGame || !selectedGame?.isValid}
            loading={isLoading}
            onClick={() => {
              onDownloadArt(selectedGame.gameId);
            }}
          >
            Auto-Import ART & CFG
          </Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button
            w={"100%"}
            backgroundColor={"var(--red-800)"}
            disabled={!selectedGame || !selectedGame?.isValid || true}
            loading={isLoading}
          >
            Purge All ART & CFG
          </Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button
            backgroundColor={"var(--red-800)"}
            w={"100%"}
            disabled={!selectedGame || !selectedGame?.isValid || true}
            loading={isLoading}
          >
            Delete Game
          </Button>
        </GridItem>
      </Grid>
    </div>
  );
};

export default GameDetailsComponent;
