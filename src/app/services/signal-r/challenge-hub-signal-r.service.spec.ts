import { TestBed } from '@angular/core/testing';

import { ChallengeHubSignalRService } from './challenge-hub-signal-r.service';

describe('ChallengeHubSignalRService', () => {
  let service: ChallengeHubSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengeHubSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
