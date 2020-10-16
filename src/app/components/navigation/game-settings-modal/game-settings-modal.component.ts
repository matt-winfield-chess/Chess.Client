import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-game-settings-modal',
	templateUrl: './game-settings-modal.component.html',
	styleUrls: ['./game-settings-modal.component.scss']
})
export class GameSettingsModalComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();

	private shouldShowSendChallengeModal: boolean = false;

	public close() {
		this.onClose.emit();
	}

	public showSendChallengeModal(): void {
		this.shouldShowSendChallengeModal = true;
	}

	public hideSendChallengeModal(): void {
		this.shouldShowSendChallengeModal = false;
	}

}
