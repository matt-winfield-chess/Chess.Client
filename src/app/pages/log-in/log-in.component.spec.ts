import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { LogInComponent } from './log-in.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticateService } from '../../services/http/authentication/authenticate.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LogInComponent', () => {
	let component: LogInComponent;
	let fixture: ComponentFixture<LogInComponent>;

	let authenticateServiceSpy: jasmine.SpyObj<AuthenticateService>;

	beforeEach(async(() => {
		authenticateServiceSpy = jasmine.createSpyObj('AuthenticateService', ['logIn']);

		TestBed.configureTestingModule({
			declarations: [LogInComponent],
			imports: [HttpClientModule, ToastrModule.forRoot(), RouterTestingModule, BrowserAnimationsModule],
			providers: [
				{ provide: AuthenticateService, useValue: authenticateServiceSpy }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LogInComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should send the username and password to the API if they are both correct', async () => {
		authenticateServiceSpy.logIn.and.resolveTo({
			data: {
				id: 1,
				username: 'username',
				token: 'test-token'
			},
			errors: [],
			isSuccess: true
		});

		component.username = 'username';
		component.password = 'password';

		await component.logIn();

		expect(authenticateServiceSpy.logIn).toHaveBeenCalledWith('username', 'password');
	});
});
