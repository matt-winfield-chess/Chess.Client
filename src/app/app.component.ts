import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { UpdateService } from 'src/app/services/updates/update.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'ChessClient';

	constructor(updateService: UpdateService) {
		updateService.checkForUpdates();
	}
}
