import { Component, Inject } from '@angular/core';
import { AuthenticateService } from '../../services/http/authentication/authenticate.service';
import { LoginStateService } from '../../services/login-state.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
	selector: 'app-log-in',
	templateUrl: './log-in.component.html',
	styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {

	public username: string;
	public password: string;

	constructor(private authenticateService: AuthenticateService, private loginStateService: LoginStateService,
		private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) { }

	public async logIn(): Promise<void> {
		this.spinner.show();
		let loginResult = await this.authenticateService.logIn(this.username, this.password);
		this.spinner.hide();

		if (loginResult.isSuccess) {
			this.loginStateService.logIn(loginResult.data.token, loginResult.data.username);
			this.router.navigate(['/']);
			this.toastr.success('Logged in!');
			return;
		}

		if (loginResult.errors) {
			this.toastr.error(loginResult.errors.join(', '), 'Login failed!');
		} else {
			this.toastr.error('Failed to connect', 'Login failed!');
		}
	}
}
