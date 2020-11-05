import { PlayerColor } from '../enums/player-color.enum';
import { Piece } from './piece';
import { CastlingState } from './castling-state';
import { FenParserService } from '../services/fen-parser.service';

export class BoardState {

	constructor(private fenParser: FenParserService) { }

	public valid: boolean;
	public pieces: Piece[];
	public activeColor: PlayerColor = PlayerColor.White;
	public castlingState: CastlingState = new CastlingState();
	public enPassantTargetSquare: [number, number];
	public halfmoveClock: number = 1;
	public fullmoveNumber: number = 1;

	public getFen(): string {
		return this.fenParser.convertBoardStateToFen(this);
	}
}
