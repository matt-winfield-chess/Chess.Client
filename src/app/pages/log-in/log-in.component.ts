import { Component } from '@angular/core';
import { AuthenticateService } from '../../services/http/authentication/authenticate.service';
import { LoginStateService } from '../../services/login-state.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/base-component';

@Component({
	selector: 'app-log-in',
	templateUrl: './log-in.component.html',
	styleUrls: ['./log-in.component.scss']
})
export class LogInComponent extends BaseComponent {

	public username: string;
	public password: string;

	constructor(protected toastr: ToastrService, private authenticateService: AuthenticateService, private loginStateService: LoginStateService,
		private spinner: NgxSpinnerService, private router: Router) {
		super(toastr);
	}

	public async logIn(): Promise<void> {
		this.spinner.show();
		let loginResponse = await this.requestWithToastr(() => this.authenticateService.logIn(this.username, this.password),
			'Login failed!');
		this.spinner.hide();

		if (loginResponse) {
			this.loginStateService.logIn(loginResponse.token, loginResponse.username);
			this.router.navigate(['/']);
			this.toastr.success('Logged in!');
		}
	}
}
