import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';
import { Provider } from "./components/ui/provider"

class App extends Component {
    render() {
        return <Provider><h2>Hello from React!</h2></Provider>;
    }
}

const root = createRoot(document.body);
root.render(<App />);