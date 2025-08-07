export interface SystemState {
  isLoading: boolean;
}

export class SystemService {
  private subscribers: ((state: SystemState) => void)[] = [];

  private state: SystemState = {
    isLoading: false,
  };

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

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback({ ...this.state }));
  }

  public async toggleIsLoading(value: boolean) {
    this.state.isLoading = value;
    this.notifySubscribers();
  }
}
