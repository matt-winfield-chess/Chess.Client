import { PieceMovedEvent } from './piece-moved-event';

describe('PieceDraggedEvent', () => {
	it('should create an instance', () => {
		expect(new PieceMovedEvent()).toBeTruthy();
	});
});
