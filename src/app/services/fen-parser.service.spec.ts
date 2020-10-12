import { TestBed } from '@angular/core/testing';

import { FenParserService } from './fen-parser.service';

describe('FenParserService', () => {
  let service: FenParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FenParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
