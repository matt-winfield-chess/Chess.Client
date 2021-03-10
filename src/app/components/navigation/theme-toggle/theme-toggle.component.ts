import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Themes, ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'app-theme-toggle',
	templateUrl: './theme-toggle.component.html',
	styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
	public isDark: boolean;

	constructor(private themeService: ThemeService) {
		this.isDark = themeService.getTheme() == Themes.Dark;
	}

	public onThemeChange(event: MatSlideToggleChange) {
		let theme = event.checked ? Themes.Dark : Themes.Light;

		this.themeService.setTheme(theme);
	}
}
