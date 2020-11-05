import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginStateService } from 'src/app/services/login-state.service';

@Component({
	selector: 'app-game-settings-modal',
	templateUrl: './game-settings-modal.component.html',
	styleUrls: ['./game-settings-modal.component.scss']
})
export class GameSettingsModalComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();

	public shouldShowSendChallengeModal: boolean = false;

	constructor(@Inject(LoginStateService) private loginStateService: LoginStateService,
		@Inject(ToastrService) private toastr: ToastrService, private router: Router) { }

	public close(): void {
		this.onClose.emit();
	}

	public showSendChallengeModal(): void {
		if (!this.loginStateService.isLoggedIn()) {
			this.toastr.error('You must be logged in to send a challenge', 'Cannot send challenge');
		} else {
			this.shouldShowSendChallengeModal = true;
		}
	}

	public hideSendChallengeModal(): void {
		this.shouldShowSendChallengeModal = false;
	}
}
