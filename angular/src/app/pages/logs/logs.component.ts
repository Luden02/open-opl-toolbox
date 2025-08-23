import { Component } from '@angular/core';
import { LogEntry, LogsService } from '../../shared/services/logs.service';
import { CommonModule } from '@angular/common';
import { ClrCheckboxModule, ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs',
  imports: [CommonModule, ClrCheckboxModule, FormsModule, ClarityModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  logs: LogEntry[] = [];

  constructor(private readonly _logger: LogsService) {}

  get verboseMode(): boolean {
    return this._logger.isVerboseMode;
  }

  ngOnInit() {
    this._logger.getLogs().subscribe((logs) => {
      this.logs = logs;
    });
  }

  toggleVerboseMode() {
    this._logger.toggleVerboseMode();
  }
}
