import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LogEntry {
  timestamp: Date;
  location: string;
  message: string;
  type: 'INFO' | 'ERROR';
  level: 'NORMAL' | 'VERBOSE';
}

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  private logs: LogEntry[] = [];

  private logsSubject = new BehaviorSubject<LogEntry[]>(this.logs);

  getLogs(): Observable<LogEntry[]> {
    return this.logsSubject.asObservable();
  }

  log(location: string, message: string): void {
    this.addLog(location, message, 'INFO', 'NORMAL');
  }

  error(location: string, message: string): void {
    this.addLog(location, message, 'ERROR', 'NORMAL');
  }

  verbose(location: string, message: string): void {
    this.addLog(location, message, 'INFO', 'VERBOSE');
  }

  private addLog(
    location: string,
    message: string,
    type: 'INFO' | 'ERROR',
    level: 'NORMAL' | 'VERBOSE'
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      location,
      message,
      type,
      level,
    };
    this.logs.push(entry);
    this.logsSubject.next([...this.logs]);
  }

  clearLogs(): void {
    this.logs = [];
    this.logsSubject.next([]);
  }
}
