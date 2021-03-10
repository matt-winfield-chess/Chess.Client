import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/classes/models/game';
import { UserNotification } from 'src/app/classes/models/user-notification';
import { GamesService } from 'src/app/services/http/games/games.service';
import { LoginStateService } from 'src/app/services/login-state.service';
import { NavbarButtonComponent } from '../navbar-button/navbar-button.component';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

	@Output() onOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild('notificationsNavbarButton') notificationsNavbarButton: NavbarButtonComponent;

	constructor(private loginStateService: LoginStateService,
		private gamesService: GamesService,
		private router: Router) {

		this.loginStateService.subscribeToLogIn(() => this.onLogIn());
		this.loginStateService.subscribeToLogOut(() => this.onLogOut());
	}

	public notifications: UserNotification[] = [];
	public displayNotifications: boolean = false;

	public ngOnInit(): void {
		this.updateNotifications();
	}

	public hide(): void {
		this.notificationsNavbarButton.setActive(false);
		this.displayNotifications = false;
	}

	public toggleNotificationsVisibility(): void {
		this.displayNotifications = this.displayNotifications ? false : true;
		if (this.displayNotifications) {
			this.onOpened.emit(this.displayNotifications);
		}
		this.notificationsNavbarButton.setActive(this.displayNotifications);
	}

	private onLogIn(): void {
		this.updateNotifications();
	}

	private onLogOut(): void {
		this.notifications = [];
	}

	private async updateNotifications(): Promise<void> {
		if (this.loginStateService.isLoggedIn()) {
			let response = await this.gamesService.getActiveGames();
			if (response?.isSuccess) {
				this.notifications = this.convertGamesToNotifications(response.data);
			}
		}
		this.updateBadge();
	}

	private convertGamesToNotifications(games: Game<any>[]): UserNotification[] {
		let notifications: UserNotification[] = [];
		for (let game of games) {
			let notification = new UserNotification();
			notification.title = 'Game in progress';
			notification.details = `${game.whitePlayer.username} vs ${game.blackPlayer.username}`;
			notification.acceptText = 'Join';
			notification.declineText = 'Forfeit';

			notification.acceptCallback = () => this.router.navigate(['/game', game.id]);
			notification.declineCallback = () => { };

			notifications.push(notification);
		}
		return notifications;
	}

	private updateBadge(): void {
		if (this.notifications.length > 0) {
			this.notificationsNavbarButton?.setBadgeText(this.notifications.length.toString());
			this.notificationsNavbarButton?.setBadgeVisible(true);
		} else {
			this.notificationsNavbarButton?.setBadgeVisible(false);
		}
	}
}
