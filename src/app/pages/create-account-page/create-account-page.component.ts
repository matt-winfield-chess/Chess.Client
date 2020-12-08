import { Component, Inject } from '@angular/core';
import { UsersService } from '../../services/http/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-create-account-page',
	templateUrl: './create-account-page.component.html',
	styleUrls: ['./create-account-page.component.scss']
})
export class CreateAccountPageComponent {
	public username: string;
	public password: string;
	public passwordConfirm: string;

	public displayInvalidUsernameMessage: boolean = false;
	public displayInvalidPasswordMessage: boolean = false;
	public displayNonMatchingPasswords: boolean = false;

	constructor(private usersService: UsersService, private toastr: ToastrService,
		private spinner: NgxSpinnerService, private router: Router) { }

	public async signUp(): Promise<void> {
		this.resetErrorMessages();

		let hasErrors = this.areErrorsPresent();

		if (hasErrors) return;

		try {
			this.spinner.show();
			let accountCreationResult = await this.usersService.createAccount(this.username, this.password);
			this.spinner.hide();

			if (accountCreationResult.isSuccess) {
				this.router.navigate(['/']);
				this.toastr.success('Account created successfully!');
			} else if (accountCreationResult.errors) {
				this.toastr.error(accountCreationResult.errors.join(', '), 'Account creation failed!');
			} else {
				this.toastr.error('Failed to connect', 'Account creation failed!');
			}
		} catch (e) {
			this.toastr.error(e.message, 'Account creation failed!');
		}
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
