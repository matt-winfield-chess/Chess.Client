import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/http/users/users.service';
import { BaseComponent } from '../../components/base-component';

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent extends BaseComponent implements OnInit {

	public pieceMovementMethod: number = 0;

	constructor(private usersService: UsersService, protected toastr: ToastrService) {
		super(toastr);
	}

	public async ngOnInit(): Promise<void> {

		var movementMethod = await this.requestWithToastr(() => this.usersService.getPieceMovementMethod(),
			'Failed to retrieve settings');

		if (movementMethod) {
			this.pieceMovementMethod = movementMethod;
		}
	}

	public async onPieceMovementMethodChange(newValue: number) {
		await this.requestWithToastr(() => this.usersService.setPieceMovementMethod(newValue),
			'Failed to update settings');
	}
}
