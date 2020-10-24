import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-navbar-button',
	templateUrl: './navbar-button.component.html',
	styleUrls: ['./navbar-button.component.scss']
})
export class NavbarButtonComponent {
	@Output() onClick: EventEmitter<void> = new EventEmitter<void>();

	public showBadge: boolean = false;
	public badgeContents: string = '';
	public active: boolean = false;

	public click(): void {
		this.onClick.emit();
	}

	public setBadgeText(text: string): void {
		this.badgeContents = text;
	}

	public setBadgeVisible(visible: boolean): void {
		this.showBadge = visible;
	}

	public setActive(active: boolean): void {
		this.active = active;
	}
}
