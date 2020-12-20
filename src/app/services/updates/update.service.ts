import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Console } from 'console';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { UpdateToastComponent } from 'src/app/components/toasts/update-toast/update-toast.component';
import { first } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UpdateService {

	private readonly checkForUpdateInterval: number = 60 * 1000 // Every minute = 60s * 1000ms

	constructor(applicationRef: ApplicationRef, private updates: SwUpdate, private toastr: ToastrService) {
		if (updates.isEnabled) {
			console.log('Service worker enabled');

			// Wait for application to be stable then check for app updates regularly
			applicationRef.isStable.pipe(first(isStable => isStable === true)).subscribe(() => {
				interval(this.checkForUpdateInterval).subscribe(() => {
					updates.checkForUpdate();
				});
			});
		}
	}

	public checkForUpdates(): void {
		this.updates.available?.subscribe(event => {
			this.toastr.warning('Reload page to get latest version', 'Update available', {
				toastComponent: UpdateToastComponent,
				closeButton: true,
				disableTimeOut: true
			});
		});
	}
}
