import { Component } from '@angular/core';
import { GamecardComponent } from './components/gamecard/gamecard.component';

@Component({
  selector: 'app-library',
  imports: [GamecardComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {}
