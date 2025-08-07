export interface SystemState {
  isLoading: boolean;
}

export class SystemService {
  private static instance: SystemService;
  private readonly subscribers: ((state: SystemState) => void)[] = [];

  private readonly state: SystemState = {
    isLoading: false,
  };

  public static getInstance(): SystemService {
    if (!SystemService.instance) {
      SystemService.instance = new SystemService();
    }
    return SystemService.instance;
  }

  subscribe(callback: (state: SystemState) => void) {
    this.subscribers.push(callback);
    callback(this.state); // Send initial state

    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  unsubscribe(callback: (state: SystemState) => void) {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  public async toggleIsLoading(value: boolean) {
    this.state.isLoading = value;
    this.notifySubscribers();
  }
}
