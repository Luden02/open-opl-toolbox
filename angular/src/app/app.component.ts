import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LogsService } from './shared/services/logs.service';
import PackageInfo from '../../../package.json';

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

    this._logger.log('AppComponent', `OS: ${os}`);
    this._logger.log('AppComponent', PackageInfo.version);
  }
}
