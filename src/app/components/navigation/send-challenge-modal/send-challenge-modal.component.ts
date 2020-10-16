import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-send-challenge-modal',
	templateUrl: './send-challenge-modal.component.html',
	styleUrls: ['./send-challenge-modal.component.scss']
})
export class SendChallengeModalComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();

	public close() {
		this.onClose.emit();
	}
}
