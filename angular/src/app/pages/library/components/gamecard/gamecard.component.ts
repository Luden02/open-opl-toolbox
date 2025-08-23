import { Component, Input } from '@angular/core';
import { Game } from '../../../../shared/types/game.type';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-gamecard',
  imports: [ClarityModule],
  templateUrl: './gamecard.component.html',
  styleUrl: './gamecard.component.scss',
})
export class GamecardComponent {
  @Input() game: Game | undefined;
}
