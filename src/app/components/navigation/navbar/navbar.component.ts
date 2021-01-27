import { Component, Inject, ViewChild } from '@angular/core';
import { LoginStateService } from 'src/app/services/login-state.service';
import { ChallengesComponent } from '../challenges/challenges.component';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

	@ViewChild('notifications') notifications: NotificationsComponent;
	@ViewChild('challenges') challenges: ChallengesComponent

	constructor(private loginStateService: LoginStateService) { }

	public onNotificationsOpened(): void {
		this.challenges.hide();
	}

	public onChallengesOpened(): void {
		this.notifications.hide();
	}

	public shouldShowLoggedInButtons(): boolean {
		return this.loginStateService.isLoggedIn();
	}

	public getUsername(): string {
		return this.loginStateService.getUsername();
	}

	public logOut(): void {
		this.loginStateService.clearToken();
	}
}
