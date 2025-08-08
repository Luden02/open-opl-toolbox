import { Button, Field, Grid, GridItem, Image, Input } from "@chakra-ui/react";
import { GameObject } from "../../../types";
import React from "react";

interface GameDetailsComponentProps {
  selectedGame: GameObject;
}

const GameDetailsComponent: React.FC<GameDetailsComponentProps> = ({
  selectedGame,
}) => {
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
            <Input placeholder="" variant="subtle" />
          </Field.Root>
        </GridItem>
        <GridItem colSpan={6}>
          <Field.Root>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Field.Label>GameID</Field.Label>
            <Input placeholder="" variant="subtle" />
          </Field.Root>
        </GridItem>
        <GridItem
          colSpan={6}
          display={"flex"}
          alignItems={"end"}
          justifyContent={"center"}
        >
          <Button w={"100%"}>Save Name & ID</Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button w={"100%"}>Auto-Import Art</Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button w={"100%"}>Purge All Art</Button>
        </GridItem>
        <GridItem colSpan={12}>
          <Button backgroundColor={"var(--red)"} w={"100%"}>
            Delete Game
          </Button>
        </GridItem>
      </Grid>
    </div>
  );
};

export default GameDetailsComponent;
