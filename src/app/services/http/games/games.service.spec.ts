import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { GamesService } from './games.service';

describe('GamesService', () => {
	let service: GamesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule]
		});
		service = TestBed.inject(GamesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
