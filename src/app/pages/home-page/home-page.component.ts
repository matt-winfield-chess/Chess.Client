import { Component } from '@angular/core';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
	public shouldShowGameSettingsModal = false;

	public openGameSettingsModal(): void {
		this.shouldShowGameSettingsModal = true;
	}

	public closeGameSettingsModal(): void {
		this.shouldShowGameSettingsModal = false;
	}
}
