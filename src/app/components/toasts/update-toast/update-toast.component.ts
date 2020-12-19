import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-update-toast',
	templateUrl: './update-toast.component.html',
	styleUrls: ['./update-toast.component.scss'],
	host: { 'class': 'ngx-toastr' }
})
export class UpdateToastComponent extends Toast {

	constructor(
		protected toastrService: ToastrService,
		public toastPackage: ToastPackage,
		private serviceWorkerUpdate: SwUpdate
	) {
		super(toastrService, toastPackage);
	}

	public reload(event: Event): boolean {
		event.stopPropagation();
		this.toastPackage.triggerAction();

		this.serviceWorkerUpdate.activateUpdate().then(() => {
			location.reload();
		});

		return false;
	}
}
