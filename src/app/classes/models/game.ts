import { User } from './user';

export class Game<T> {
	public id: string;
	public whitePlayer: User;
	public blackPlayer: User;
	public moves: T[];
	public active: boolean;
	public fen: string;
	public drawOffer: string;
}
