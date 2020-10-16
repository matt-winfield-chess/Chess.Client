import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MovementStrategyFactoryService } from './movement-strategy-factory.service';

describe('MovementStrategyFactoryService', () => {
	let service: MovementStrategyFactoryService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
		service = TestBed.inject(MovementStrategyFactoryService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
