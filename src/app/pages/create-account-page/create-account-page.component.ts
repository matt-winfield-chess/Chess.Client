import { Component, Inject } from '@angular/core';
import { UsersService } from '../../services/http/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/components/base-component';

@Component({
	selector: 'app-create-account-page',
	templateUrl: './create-account-page.component.html',
	styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent extends BaseComponent {
	public username: string;
	public password: string;
	public passwordConfirm: string;

	public displayInvalidUsernameMessage: boolean = false;
	public displayInvalidPasswordMessage: boolean = false;
	public displayNonMatchingPasswords: boolean = false;

	constructor(protected toastr: ToastrService, private usersService: UsersService,
		private spinner: NgxSpinnerService, private router: Router) {
		super(toastr);
	}

	public async signUp(): Promise<void> {
		this.resetErrorMessages();

		let hasErrors = this.areErrorsPresent();

		if (hasErrors) return;

		this.spinner.show();

		await this.requestWithToastr(() => this.usersService.createAccount(this.username, this.password),
			'Account creation failed!',
			'Account creaeted successfully!',
			(data: number) => this.router.navigate(['/']));

		this.spinner.hide();
	}

	private areErrorsPresent(): boolean {
		let hasErrors = false;
		if (!this.username || !this.username.trim()) {
			this.displayInvalidUsernameMessage = true;
			hasErrors = true;
		}

		if (!this.password || !this.password.trim()) {
			this.displayInvalidPasswordMessage = true;
			hasErrors = true;
		}

		if (this.password != this.passwordConfirm) {
			this.displayNonMatchingPasswords = true;
			hasErrors = true;
		}
		return hasErrors;
	}

	private resetErrorMessages(): void {
		this.displayInvalidUsernameMessage = false;
		this.displayInvalidPasswordMessage = false;
		this.displayNonMatchingPasswords = false;
	}
}
