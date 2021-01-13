import { Game } from './models/game';
import { BoardType } from 'src/app/enums/board-type.enum';
import { PlayerColor } from '../enums/player-color.enum';

export class BoardSettings {
	public game: Game;
	public type: BoardType;
	public playerColor: PlayerColor;
	public disabled: boolean = false;

	public constructor(init?: Partial<BoardSettings>) {
		Object.assign(this, init);
	}
}
