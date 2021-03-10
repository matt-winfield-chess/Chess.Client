import { Injectable } from '@angular/core';

export enum Themes {
	Light = 'theme-light',
	Dark = 'theme-dark'
}

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private localStorageThemeKey: string = 'Chess:Theme'
	private theme: string;

	constructor() {
		this.theme = localStorage.getItem(this.localStorageThemeKey);
		if (this.theme === null || this.theme === undefined || this.theme === "") {
			this.theme = Themes.Light
		}
	}

	public setTheme(theme: Themes): void {
		localStorage.setItem(this.localStorageThemeKey, theme);
		this.theme = theme;
	}

	public getTheme(): string {
		return this.theme;
	}
}
