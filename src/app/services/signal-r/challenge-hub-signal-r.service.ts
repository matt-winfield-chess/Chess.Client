import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../config/config.service';
import { LoginStateService } from '../login-state.service';
import { SignalRService } from './signal-r.service';

@Injectable({
	providedIn: 'root'
})
export class ChallengeHubSignalRService extends SignalRService {
	constructor(configService: ConfigService, spinner: NgxSpinnerService, loginStateService: LoginStateService) {
		super(configService, spinner, 'CHALLENGE_HUB', loginStateService);
	}
}
