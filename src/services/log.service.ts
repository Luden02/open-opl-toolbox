const logBucket: string[] = [];
const subscribers: ((logs: string[]) => void)[] = [];

const writeLogLine = (
  log: string,
  level: "normal" | "verbose",
  error: boolean
) => {
  const timestamp = new Date().toISOString();
  const getPrefix = (error: boolean, level: "normal" | "verbose") => {
    if (error) return "[ERROR]";
    if (level === "verbose") return "[VERBOSE]";
    return "[INFO]";
  };
  const prefix = getPrefix(error, level);
  const formattedLog = `${timestamp} ${prefix} ${log}`;
  logBucket.push(formattedLog);
  // Notify all subscribers when a new log is added
  subscribers.forEach((callback) => callback([...logBucket]));
};

const subscribeLogBucket = (
  callback: (logs: string[]) => void,
  level?: "normal" | "verbose"
) => {
  // Create a wrapper callback that filters logs based on level
  const wrappedCallback = (logs: string[]) => {
    if (!level) {
      callback(logs);
      return;
    }

    const filteredLogs = logs.filter((log) => {
      if (level === "normal") {
        return log.includes("[INFO]") || log.includes("[ERROR]");
      }
      return true; // verbose includes all logs
    });

    callback(filteredLogs);
  };

  // Add the wrapped callback to subscribers
  subscribers.push(wrappedCallback);

  // Send initial logs
  wrappedCallback([...logBucket]);

  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(wrappedCallback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

export { writeLogLine, subscribeLogBucket };
