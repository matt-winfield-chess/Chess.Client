import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {
	public shouldShowGameSettingsModal = false;

	@ViewChild('container') public containerElement: ElementRef;

	public ngOnDestroy(): void {
		this.containerElement.nativeElement.remove();
	}

	public openGameSettingsModal(): void {
		this.shouldShowGameSettingsModal = true;
	}

	public closeGameSettingsModal(): void {
		this.shouldShowGameSettingsModal = false;
	}
}
