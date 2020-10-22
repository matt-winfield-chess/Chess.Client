import { Injectable } from '@angular/core';
import { JwtTokenBody } from 'src/app/classes/jwt-token-body';

@Injectable({
	providedIn: 'root'
})
export class LoginStateService {

	private loggedIn: boolean;

	private localStorageTokenKey: string = 'Chess:LoginToken';
	private localStorageUsernameKey: string = 'Chess:Username';

	private logInSubscribers: (() => void)[] = [];
	private logOutSubscribers: (() => void)[] = [];

	constructor() {
		if (localStorage.getItem('Chess:LoginToken')) {
			this.loggedIn = true;
		}
	}

	public logIn(token: string, username: string): void {
		localStorage.setItem(this.localStorageTokenKey, token);
		localStorage.setItem(this.localStorageUsernameKey, username);
		this.loggedIn = true;

		for (let onLogIn of this.logInSubscribers) {
			onLogIn();
		}
	}

	public clearToken(): void {
		localStorage.removeItem(this.localStorageTokenKey);
		localStorage.removeItem(this.localStorageUsernameKey);
		this.loggedIn = false;

		for (let onLogOut of this.logOutSubscribers) {
			onLogOut();
		}
	}

	public getToken(): string {
		return localStorage.getItem(this.localStorageTokenKey);
	}

	public isLoggedIn(): boolean {
		return this.loggedIn;
	}

	public getUsername(): string {
		return localStorage.getItem(this.localStorageUsernameKey);
	}

	public getUserId(): number {
		let claims = this.parseJwt(this.getToken());
		return parseInt(claims.id);
	}

	public subscribeToLogIn(onLogIn: () => void): void {
		this.logInSubscribers.push(onLogIn);
	}

	public subscribeToLogOut(onLogOut: () => void): void {
		this.logOutSubscribers.push(onLogOut);
	}

	private parseJwt(token: string): JwtTokenBody {
		let base64Payload = token.split('.')[1];
		let jsonPayload = atob(base64Payload);
		return JSON.parse(jsonPayload);
	}
}
