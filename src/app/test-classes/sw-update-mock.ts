import { Observable, Subject } from 'rxjs';
import { UpdateAvailableEvent, UpdateActivatedEvent } from '@angular/service-worker/service-worker'

export class SwUpdateMock {
	public available: Observable<UpdateAvailableEvent> = new Subject();
	public activated: Observable<UpdateActivatedEvent> = new Subject();
	public isEnabled: boolean = false;

	public checkForUpdate(): Promise<void> {
		return new Promise((resolve) => resolve());
	}
	public activateUpdate(): Promise<void> {
		return new Promise((resolve) => resolve());
	}
}