import { Component, Inject, OnInit } from '@angular/core';
import { LoginStateService } from 'src/app/services/login-state.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

	constructor(@Inject(LoginStateService) private loginStateService: LoginStateService) { }

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
