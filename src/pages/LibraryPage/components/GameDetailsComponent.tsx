import { GameObject } from "../../../types";
import React from "react";

interface GameDetailsComponentProps {
  selectedGame: GameObject;
}

const GameDetailsComponent: React.FC<GameDetailsComponentProps> = ({
  selectedGame,
}) => {
  return (
    <div>
      <h2>{selectedGame?.name}</h2>
    </div>
  );
};

export default GameDetailsComponent;
