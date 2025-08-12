/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createRoot } from "react-dom/client";
import { Component } from "react";
import {
  ChakraProvider,
  Container,
  defaultSystem,
  Flex,
  Image,
  Tabs,
  Theme,
} from "@chakra-ui/react";
import LibraryPageComponent from "./pages/LibraryPage/LibraryPageComponent";
import LogPageComponent from "./pages/LogPage/LogPageComponent";
import { ElectronAPI } from "./types";
import { writeLogLine } from "./services/log.service";
import packageInfo from "../package.json";

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

type props = object;

type state = {
  logoSrc: string;
};
class App extends Component<props, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      logoSrc: "",
    };
  }

  componentDidMount() {
    window.electronAPI
      .getAsset("logo_short.png")
      .then((logoSrc: { data: string }) => {
        this.setState({ logoSrc: logoSrc.data });
      })
      .catch((error) => {
        writeLogLine("Failed to load logo", "normal", error);
      });
  }

  render() {
    return (
      <Tabs.Root
        defaultValue={"library"}
        height="100vh"
        display="flex"
        flexDirection="column"
      >
        {/* @ts-ignore */}
        <Tabs.List>
          {/* @ts-ignore */}
          <Tabs.Trigger value="library">Library</Tabs.Trigger>
          {/* @ts-ignore */}
          <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
          {/* @ts-ignore */}
          <Tabs.Trigger value="info">Info</Tabs.Trigger>
          {/* @ts-ignore */}
          {/* <Tabs.Trigger value="batch-actions">Batch Actions</Tabs.Trigger> */}
        </Tabs.List>
        {/* @ts-ignore */}
        <Tabs.Content value="library" height={"100%"}>
          <LibraryPageComponent />
        </Tabs.Content>
        {/* @ts-ignore */}
        <Tabs.Content value="logs" height={"100%"}>
          <LogPageComponent />
        </Tabs.Content>
        {/* @ts-ignore */}
        <Tabs.Content value="info" height={"100%"}>
          <Flex direction="column" alignItems="center" marginTop="32px">
            {this.state.logoSrc && <Image src={this.state.logoSrc}></Image>}
            <div style={{ marginTop: "24px" }}>
              OpenOPL Toolbox - Version: {packageInfo.version}
            </div>
            <div style={{ marginTop: "12px" }}>
              Made with love by Luden for the PS2 Homebrew Community
            </div>
            <div style={{ marginTop: "32px" }}>Special thanks to:</div>
            <div style={{ marginTop: "4px" }}>r/PS2Homebrew</div>
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    );
  }
}

const root = createRoot(document.body);
root.render(
  <ChakraProvider value={defaultSystem}>
    <Theme appearance="light">
      <Container minHeight="100vh" minWidth={"100vW"} margin={0} padding={0}>
        <App />
      </Container>
    </Theme>
  </ChakraProvider>
);
