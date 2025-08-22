import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LogsService } from './shared/services/logs.service';
import PackageInfo from '../../../package.json';
import { ClarityModule, ClrVerticalNavModule } from '@clr/angular';
import {
  ClarityIcons,
  hardDriveIcon,
  resistorIcon,
  unknownStatusIcon,
} from '@cds/core/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ClarityModule,
    ClrVerticalNavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly _logger: LogsService) {}

  ngOnInit() {
    ClarityIcons.addIcons(hardDriveIcon, unknownStatusIcon, resistorIcon);
    const os = window.navigator.platform;

    this._logger.log(
      'AppComponent',
      `App initialized (${PackageInfo.version}) [OS: ${os}]`
    );
  }
}
