import { async, TestBed } from '@angular/core/testing';
import { FenParserService } from '../services/fen-parser.service';
import { BoardState } from './board-state';

describe('FenParseResult', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({})
			.compileComponents();
	}));

	it('should create an instance', () => {
		expect(new BoardState(TestBed.inject(FenParserService))).toBeTruthy();
	});
});
