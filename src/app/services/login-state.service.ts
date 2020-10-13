import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoginStateService {

	private _isLoggedIn: boolean;

	private localStorageTokenKey: string = 'Chess:LoginToken';
	private localStorageUsernameKey: string = 'Chess:Username';

	constructor() {
		if (localStorage.getItem('Chess:LoginToken')) {
			this._isLoggedIn = true;
		}
	}

	public logIn(token: string, username: string): void {
		localStorage.setItem(this.localStorageTokenKey, token);
		localStorage.setItem(this.localStorageUsernameKey, username);
		this._isLoggedIn = true;
	}

	public clearToken(): void {
		localStorage.removeItem(this.localStorageTokenKey);
		localStorage.removeItem(this.localStorageUsernameKey);
		this._isLoggedIn = false;
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
}
