import React, { Component } from "react";
import { subscribeLogBucket } from "../../services/log.service";
import { Grid, GridItem, Switch } from "@chakra-ui/react";

import "./LogPageStyle.css";
type props = {
  // Define props here
};

type state = {
  logs: string[];
  verboseToggle: boolean;
};

class LogPageComponent extends Component<props, state> {
  private unsubscribe?: () => void;
  constructor(props: props) {
    super(props);
    this.state = {
      logs: [],
      verboseToggle: false,
    };
  }

  componentDidMount() {
    // Subscribe to log updates when component mounts
    this.unsubscribe = subscribeLogBucket((updatedLogs) => {
      this.setState({ logs: updatedLogs });
    }, "normal");
  }

  componentWillUnmount() {
    // Unsubscribe when component unmounts to prevent memory leaks
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  getLogClassName(log: string) {
    if (log.includes("[ERROR]")) {
      return "error";
    } else if (log.includes("[INFO]")) {
      return "info";
    } else if (log.includes("[VERBOSE]")) {
      return "verbose";
    } else {
      return "info";
    }
  }

  render() {
    const { logs } = this.state;

    return (
      <div className="container">
        <div className="verbose-toggle">
          <Switch.Root
            checked={this.state.verboseToggle}
            onCheckedChange={(e: any) => {
              const newVerboseState = e.checked;
              this.setState({ verboseToggle: newVerboseState }, () => {
                // Unsubscribe from current subscription
                if (this.unsubscribe) {
                  this.unsubscribe();
                }

                // Subscribe with new verbose setting
                this.unsubscribe = subscribeLogBucket(
                  (updatedLogs) => {
                    this.setState({ logs: updatedLogs });
                  },
                  this.state.verboseToggle ? "verbose" : "normal"
                );
              });
            }}
          >
            <Switch.HiddenInput />
            <Switch.Control />
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Switch.Label>Verbose</Switch.Label>
          </Switch.Root>
        </div>
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className={this.getLogClassName(log)}>
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default LogPageComponent;
