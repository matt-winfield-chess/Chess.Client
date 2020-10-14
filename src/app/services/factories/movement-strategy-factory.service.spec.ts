import { TestBed } from '@angular/core/testing';

import { MovementStrategyFactoryService } from './movement-strategy-factory.service';

describe('MovementStrategyFactoryService', () => {
  let service: MovementStrategyFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovementStrategyFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
