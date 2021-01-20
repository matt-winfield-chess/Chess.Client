import { Injectable } from '@angular/core';
import { parse } from 'path';
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
		let token = localStorage.getItem(this.localStorageTokenKey);
		if (token) {
			if (this.hasTokenExpired(token)) {
				this.clearToken();
			} else {
				this.loggedIn = true;
			}
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
		let token = localStorage.getItem(this.localStorageTokenKey);
		if (this.hasTokenExpired(token)) {
			this.clearToken();
			return null;
		}
		return token;
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

	private hasTokenExpired(token: string): boolean {
		let parsedToken = this.parseJwt(token);

		return Date.now() >= parsedToken.exp * 1000;
	}

	private parseJwt(token: string): JwtTokenBody {
		let base64Payload = token.split('.')[1];
		let jsonPayload = atob(base64Payload);
		return JSON.parse(jsonPayload);
	}
}
