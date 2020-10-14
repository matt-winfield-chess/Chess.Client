import { TestBed } from '@angular/core/testing';
import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';

import { FenParserService } from './fen-parser.service';

describe('FenParserService', () => {
	let service: FenParserService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FenParserService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should parse pieces with the correct position', () => {
		let testFen = '4r3/8/8/8/8/8/8/R7 w KQkq - 0 1';

		let result = service.parseFen(testFen);
		let pieces = result.pieces;

		expect(result.valid).toBeTrue();
		expect(pieces.some(piece =>
			piece.x == 4
			&& piece.y == 0
			&& piece.pieceType == PieceType.Rook
			&& piece.color == PlayerColor.Black
		));
		expect(pieces.some(piece =>
			piece.x == 0
			&& piece.y == 7
			&& piece.pieceType == PieceType.Rook
			&& piece.color == PlayerColor.White
		));
	});

	it('should identify correct active color when color is white', () => {
		let testFen = '8/8/8/8/8/8/8/8 w KQkq - 0 1';

		let result = service.parseFen(testFen);

		expect(result.valid).toBeTrue();
		expect(result.activeColor).toBe(PlayerColor.White);
	});

	it('should identify correct active color when color is black', () => {
		let testFen = '8/8/8/8/8/8/8/8 b KQkq - 0 1';

		let result = service.parseFen(testFen);

		expect(result.valid).toBeTrue();
		expect(result.activeColor).toBe(PlayerColor.Black);
	});

	it('should identify correct castling state when all castling available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w KQkq - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeTrue();
		expect(castlingState.whiteQueenside).toBeTrue();
		expect(castlingState.blackKingside).toBeTrue();
		expect(castlingState.blackQueenside).toBeTrue();
	});

	it('should identify correct castling state when no castling available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w - - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeFalse();
		expect(castlingState.whiteQueenside).toBeFalse();
		expect(castlingState.blackKingside).toBeFalse();
		expect(castlingState.blackQueenside).toBeFalse();
	});

	it('should identify correct castling state when only white kingside available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w K - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeTrue();
		expect(castlingState.whiteQueenside).toBeFalse();
		expect(castlingState.blackKingside).toBeFalse();
		expect(castlingState.blackQueenside).toBeFalse();
	});

	it('should identify correct castling state when only white queenside available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w Q - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeFalse();
		expect(castlingState.whiteQueenside).toBeTrue();
		expect(castlingState.blackKingside).toBeFalse();
		expect(castlingState.blackQueenside).toBeFalse();
	});

	it('should identify correct castling state when only black kingside available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w k - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeFalse();
		expect(castlingState.whiteQueenside).toBeFalse();
		expect(castlingState.blackKingside).toBeTrue();
		expect(castlingState.blackQueenside).toBeFalse();
	});

	it('should identify correct castling state when only black queenside available', () => {
		let testFen = '8/8/8/8/8/8/8/8 w q - 0 1';

		let result = service.parseFen(testFen);
		let castlingState = result.castlingState;

		expect(result.valid).toBeTrue();
		expect(castlingState.whiteKingside).toBeFalse();
		expect(castlingState.whiteQueenside).toBeFalse();
		expect(castlingState.blackKingside).toBeFalse();
		expect(castlingState.blackQueenside).toBeTrue();
	});

	it('should identify correct en-passant target square e3', () => {
		let testFen = '8/8/8/8/8/8/8/8 w q e3 0 1';

		let result = service.parseFen(testFen);

		expect(result.valid).toBeTrue();
		expect(result.enPassantTargetSquare).toEqual([4, 5]);
	});

	it('should identify correct en-passant target square e6', () => {
		let testFen = '8/8/8/8/8/8/8/8 w q e6 0 1';

		let result = service.parseFen(testFen);

		expect(result.valid).toBeTrue();
		expect(result.enPassantTargetSquare).toEqual([4, 2]);
	});

	it('should identify correct en-passant target square d3', () => {
		let testFen = '8/8/8/8/8/8/8/8 w q d3 0 1';

		let result = service.parseFen(testFen);

		expect(result.valid).toBeTrue();
		expect(result.enPassantTargetSquare).toEqual([3, 5]);
	});
});
