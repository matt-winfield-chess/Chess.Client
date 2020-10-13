import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AuthenticateService } from './authenticate.service';

describe('AuthenticateService', () => {
	let service: AuthenticateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule]
		});
		service = TestBed.inject(AuthenticateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
