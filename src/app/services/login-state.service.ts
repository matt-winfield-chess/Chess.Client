import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoginStateService {

	private _isLoggedIn: boolean;

	private localStorageTokenKey: string = 'Chess:LoginToken';
	private localStorageUsernameKey: string = 'Chess:Username';

	private logInSubscribers: (() => void)[] = [];
	private logOutSubscribers: (() => void)[] = [];

	constructor() {
		if (localStorage.getItem('Chess:LoginToken')) {
			this._isLoggedIn = true;
		}
	}

	public logIn(token: string, username: string): void {
		localStorage.setItem(this.localStorageTokenKey, token);
		localStorage.setItem(this.localStorageUsernameKey, username);
		this._isLoggedIn = true;

		for (let onLogIn of this.logInSubscribers) {
			onLogIn();
		}
	}

	public clearToken(): void {
		localStorage.removeItem(this.localStorageTokenKey);
		localStorage.removeItem(this.localStorageUsernameKey);
		this._isLoggedIn = false;

		for (let onLogOut of this.logOutSubscribers) {
			onLogOut();
		}
	}

	public getToken(): string {
		return localStorage.getItem(this.localStorageTokenKey);
	}

	public isLoggedIn(): boolean {
		return this._isLoggedIn;
	}

	public getUsername(): string {
		return localStorage.getItem(this.localStorageUsernameKey);
	}

	public subscribeToLogIn(onLogIn: () => void): void {
		this.logInSubscribers.push(onLogIn);
	}

	public subscribeToLogOut(onLogOut: () => void): void {
		this.logOutSubscribers.push(onLogOut);
	}
}
