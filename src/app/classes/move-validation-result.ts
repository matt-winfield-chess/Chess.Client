import { Move } from './move';

export class MoveValidationResult {
	public constructor(init?: Partial<MoveValidationResult>) {
		Object.assign(this, init);
	}

	public move: Move;
	public isValid: boolean;
	public isCastleMove: boolean;
	public castleRookMove: Move;
}
