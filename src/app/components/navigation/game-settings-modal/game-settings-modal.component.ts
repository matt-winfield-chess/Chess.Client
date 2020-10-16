import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-game-settings-modal',
	templateUrl: './game-settings-modal.component.html',
	styleUrls: ['./game-settings-modal.component.scss']
})
export class GameSettingsModalComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();

	public close() {
		this.onClose.emit();
	}

}
