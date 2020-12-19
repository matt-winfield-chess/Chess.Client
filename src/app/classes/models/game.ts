import { Move } from '../move';
import { User } from './user';

export class Game {
	public id: string;
	public whitePlayer: User;
	public blackPlayer: User;
	public moves: Move[];
	public active: boolean;
	public fen: string;
	public drawOffer: string;
}
