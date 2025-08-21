import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import PackageInfo from '../../../../../../package.json';
import {
  FileQuestionMarkIcon,
  LibraryIcon,
  LogsIcon,
  LucideAngularModule,
  RefreshCcwIcon,
  XIcon,
} from 'lucide-angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly version = PackageInfo.version;
  readonly libraryIcon = LibraryIcon;
  readonly fileQuestionIcon = FileQuestionMarkIcon;
  readonly logsIcon = LogsIcon;
  readonly refreshIcon = RefreshCcwIcon;
  readonly xIcon = XIcon;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router
  ) {}

  currentPath: string | undefined;

  ngOnInit() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this._router.url;
        const firstSegment = url.split('/')[1] || 'library';
        this.currentPath = firstSegment;
      });
  }
  onNavigationClick(path: string) {
    if (path === '') {
      this._router.navigate(['/']);
    } else {
      this._router.navigate(['/', path]);
    }
  }
}
