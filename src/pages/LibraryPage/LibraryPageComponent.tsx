import React, { Component } from "react";

import "./LibraryPageStyle.css";
import { Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { ElectronAPI, Library } from "../../types";
import { GameLibraryService } from "../../services/gamelibrary.service";
import GameTableComponent from "./components/GameTableComponent";
import { SystemService } from "../../services/system.service";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type Props = object;

type State = {
  library: Library;
  isLoading: boolean;
};
class LibraryPageComponent extends Component<Props, State> {
  private readonly gameLibraryService = GameLibraryService.getInstance();
  private readonly systemService = SystemService.getInstance();
  constructor(props: Props) {
    super(props);

    this.state = {
      library: {
        loadedDirectory: undefined,
        cdGamesList: [],
        dvdGamesList: [],
        selectedGame: undefined,
      },
      isLoading: false,
    };
  }

  componentDidMount() {
    this.gameLibraryService.subscribe((library: Library) => {
      this.setState({ library });
    });

    this.systemService.subscribe((state) => {
      console.log("SystemService state update:", state);
      this.setState({ isLoading: state.isLoading });
    });
  }

  componentWillUnmount() {
    this.gameLibraryService.unsubscribe((library: Library) => {
      this.setState({ library });
    });

    this.systemService.unsubscribe((state) => {
      this.setState({ isLoading: state.isLoading });
    });
  }

  render() {
    return (
      <div className="library-page">
        <Grid
          templateColumns={"repeat(12, 1fr)"}
          gap={"12px"}
          height={"calc(100% - 60px)"}
        >
          <GridItem colSpan={9} h={"100%"}>
            <GameTableComponent library={this.state.library} />
          </GridItem>
          <GridItem colSpan={3} h={"100%"}>
            test
          </GridItem>
        </Grid>
        <div className="footer-bar">
          <Button
            onClick={() => this.gameLibraryService.chooseDirectory()}
            disabled={this.state.isLoading}
            loading={this.state.isLoading}
          >
            Load Directory
          </Button>
          <Text className="directory">
            Current directory: {this.state.library.loadedDirectory || "None"}
          </Text>
        </div>
      </div>

      //     <div className="info-section">
      //       <Grid gapY={4}>
      //         <GridItem colSpan={12}>
      //           <Field.Root>
      //             {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      //             {/* @ts-ignore */}
      //             <Field.Label>Game Name</Field.Label>
      //             <Input value={this.state?.selectedGame?.name}></Input>
      //           </Field.Root>
      //         </GridItem>
      //         <GridItem colSpan={11}>
      //           <Field.Root>
      //             {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      //             {/* @ts-ignore */}
      //             <Field.Label>GameID</Field.Label>
      //             <Input value={this.state?.selectedGame?.gameId}></Input>
      //           </Field.Root>
      //         </GridItem>
      //         <GridItem colSpan={1}>
      //           <Flex justifyContent={"end"} height={"100%"} alignItems={"end"}>
      //             <div>
      //               <Button disabled>Save Edited Title & GameID</Button>
      //             </div>
      //           </Flex>
      //         </GridItem>
      //         <GridItem colSpan={8} height={"100%"}>
      //           <div className="actions-box">
      //             <Grid>
      //               <GridItem colSpan={12}>
      //                 <Button
      //                   width={"100%"}
      //                   disabled={!this.state.selectedGame}
      //                 >
      //                   Delete Game
      //                 </Button>
      //               </GridItem>
      //               <GridItem colSpan={12} marginTop={"64px"}>
      //                 <Button
      //                   width={"100%"}
      //                   disabled={!this.state.selectedGame}
      //                 >
      //                   Grab Remote Art
      //                 </Button>
      //               </GridItem>
      //               <GridItem colSpan={12} marginTop={"64px"}>
      //                 <Button
      //                   width={"100%"}
      //                   disabled={!this.state.selectedGame}
      //                 >
      //                   Remove All Art
      //                 </Button>
      //               </GridItem>
      //             </Grid>
      //           </div>
      //         </GridItem>
      //         <GridItem colSpan={1}></GridItem>
      //         <GridItem colSpan={3}>
      //           <Flex
      //             justifyContent={"center"}
      //             height={"324px"}
      //             alignItems={"center"}
      //             className="coverart-container"
      //           >
      //             <div>
      //               <GridItem colSpan={6}>
      //                 {this.state?.selectedGame ? (
      //                   this.state.selectedGame.art ? (
      //                     <Image
      //                       height={"300px"}
      //                       src={this.state.selectedGame?.art.coverart3d}
      //                     />
      //                   ) : (
      //                     <Stack height={"300px"}>
      //                       <Spinner marginTop={"150px"} />
      //                     </Stack>
      //                   )
      //                 ) : null}
      //               </GridItem>
      //             </div>
      //           </Flex>
      //         </GridItem>
      //         <GridItem colSpan={12} height={"116px"}>
      //           <div className="actions-box">
      //             <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      //               <GridItem>
      //                 <Text fontSize="sm" fontWeight="bold">
      //                   CD Games
      //                 </Text>
      //                 <Text fontSize="lg">{this.state.cdGamesList.length}</Text>
      //               </GridItem>
      //               <GridItem>
      //                 <Text fontSize="sm" fontWeight="bold">
      //                   DVD Games
      //                 </Text>
      //                 <Text fontSize="lg">
      //                   {this.state.dvdGamesList.length}
      //                 </Text>
      //               </GridItem>
      //               <GridItem>
      //                 <Text fontSize="sm" fontWeight="bold">
      //                   Total Games
      //                 </Text>
      //                 <Text fontSize="lg">
      //                   {this.state.cdGamesList.length +
      //                     this.state.dvdGamesList.length}
      //                 </Text>
      //               </GridItem>
      //               <GridItem>
      //                 <Text fontSize="sm" fontWeight="bold">
      //                   Total Size
      //                 </Text>
      //                 <Text fontSize="lg">
      //                   {(() => {
      //                     const allGames = [
      //                       ...this.state.cdGamesList,
      //                       ...this.state.dvdGamesList,
      //                     ];
      //                     const totalBytes = allGames.reduce((sum, game) => {
      //                       const sizeStr = game.size;
      //                       let bytes = 0;
      //                       if (sizeStr.includes("GB")) {
      //                         bytes = parseFloat(sizeStr) * 1024 * 1024 * 1024;
      //                       } else if (sizeStr.includes("MB")) {
      //                         bytes = parseFloat(sizeStr) * 1024 * 1024;
      //                       } else {
      //                         bytes = parseFloat(sizeStr);
      //                       }
      //                       return sum + bytes;
      //                     }, 0);

      //                     if (totalBytes >= 1024 * 1024 * 1024) {
      //                       return (
      //                         (totalBytes / (1024 * 1024 * 1024)).toFixed(2) +
      //                         " GB"
      //                       );
      //                     } else if (totalBytes >= 1024 * 1024) {
      //                       return (
      //                         (totalBytes / (1024 * 1024)).toFixed(2) + " MB"
      //                       );
      //                     } else {
      //                       return totalBytes + " bytes";
      //                     }
      //                   })()}
      //                 </Text>
      //               </GridItem>
      //             </Grid>
      //           </div>
      //         </GridItem>
      //       </Grid>
      //     </div>
      //   </div>
      //   <div className="footer-bar">
      //     <Button onClick={() => this.gameLibraryService.chooseDirectory()}>
      //       Load Directory
      //     </Button>
      //     <Text className="directory">
      //       Current directory: {this.state.loadedDirectory || "None"}
      //     </Text>
      //   </div>
      // </div>
    );
  }
}

export default LibraryPageComponent;
