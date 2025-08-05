/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createRoot } from 'react-dom/client';
import { Component } from 'react';
import { ChakraProvider, defaultSystem, Tabs, Theme } from "@chakra-ui/react"
import LibraryPageComponent from './pages/LibraryPage/LibraryPageComponent';

class App extends Component {
    render() {
        return (
                <Tabs.Root defaultValue={"library"}>
                    {/* @ts-ignore */}
                    <Tabs.List>
                        {/* @ts-ignore */}
                        <Tabs.Trigger value="library">Library</Tabs.Trigger>
                        {/* @ts-ignore */}
                        {/* <Tabs.Trigger value="batch-actions">Batch Actions</Tabs.Trigger> */}
                    </Tabs.List>
                    {/* @ts-ignore */}
                    <Tabs.Content value="library"><LibraryPageComponent /></Tabs.Content>
                </Tabs.Root>
        );
    }
}

const root = createRoot(document.body);
root.render(<ChakraProvider value={defaultSystem}><Theme appearance='light'><App /></Theme></ChakraProvider>);