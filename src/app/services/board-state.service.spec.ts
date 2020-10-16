import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BoardStateService } from './board-state.service';

describe('BoardStateService', () => {
	let service: BoardStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
		service = TestBed.inject(BoardStateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
