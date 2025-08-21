import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LogsService } from './shared/services/logs.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly _logger: LogsService) {}

  ngOnInit() {
    const os = window.navigator.platform;

    this._logger.verbose('AppComponent', `OS: ${os}`);
  }
}
