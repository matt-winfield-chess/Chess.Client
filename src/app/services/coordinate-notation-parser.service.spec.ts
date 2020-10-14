import { TestBed } from '@angular/core/testing';

import { CoordinateNotationParserService } from './coordinate-notation-parser.service';

describe('CoordinateNotationParserService', () => {
  let service: CoordinateNotationParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordinateNotationParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
