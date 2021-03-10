import { Component } from '@angular/core';
import { UpdateService } from 'src/app/services/updates/update.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'ChessClient';

	constructor(updateService: UpdateService, private themeService: ThemeService) {
		updateService.checkForUpdates();
	}

	public getTheme(): string {
		return this.themeService.getTheme();
	}
}
