import { Inject, Injectable } from '@angular/core';
import { DiagonalMovementStrategy } from 'src/app/classes/movement-strategies/diagonal-movement-strategy';
import { KnightMovementStrategy } from 'src/app/classes/movement-strategies/knight-movement-strategy';
import { MovementStrategy } from 'src/app/classes/movement-strategies/movement-strategy';
import { PawnMovementStrategy } from 'src/app/classes/movement-strategies/pawn-movement-strategy';
import { SingleSquareMovementStrategy } from 'src/app/classes/movement-strategies/single-square-movement-strategy';
import { StraightMovementStrategy } from 'src/app/classes/movement-strategies/straight-movement-strategy';
import { PieceType } from 'src/app/enums/piece-type.enum';
import { BoardStateService } from '../board-state.service';

@Injectable({
	providedIn: 'root'
})
export class MovementStrategyFactoryService {

	constructor(@Inject(BoardStateService) private boardStateService: BoardStateService) { }

	public createStrategies(pieceType: PieceType): MovementStrategy[] {
		switch (pieceType) {
			case PieceType.Pawn:
				return [new PawnMovementStrategy(this.boardStateService)];
			case PieceType.Rook:
				return [new StraightMovementStrategy(this.boardStateService)];
			case PieceType.Knight:
				return [new KnightMovementStrategy(this.boardStateService)];
			case PieceType.Bishop:
				return [new DiagonalMovementStrategy(this.boardStateService)];
			case PieceType.Queen:
				return [new DiagonalMovementStrategy(this.boardStateService), new StraightMovementStrategy(this.boardStateService)];
			case PieceType.King:
				return [new SingleSquareMovementStrategy(this.boardStateService)];
		}
	}
}
