import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ChallengesService } from './challenges.service';

describe('ChallengesService', () => {
	let service: ChallengesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule]
		});
		service = TestBed.inject(ChallengesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
