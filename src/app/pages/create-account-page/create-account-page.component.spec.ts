import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateAccountPageComponent } from './create-account-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from 'src/app/services/http/users/users.service';
import { ApiResponse } from 'src/app/classes/models/api-response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateAccountPageComponent', () => {
	let component: CreateAccountPageComponent;
	let fixture: ComponentFixture<CreateAccountPageComponent>;
	let usersServiceSpy: jasmine.SpyObj<UsersService>;

	beforeEach(async(() => {
		usersServiceSpy = jasmine.createSpyObj('UsersService', ['createAccount']);

		TestBed.configureTestingModule({
			declarations: [CreateAccountPageComponent],
			imports: [HttpClientModule, ToastrModule.forRoot(), NgxSpinnerModule, RouterTestingModule, BrowserAnimationsModule],
			providers: [
				{ provide: UsersService, useValue: usersServiceSpy }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreateAccountPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display invalid username message if username is empty', async () => {
		component.username = '';
		component.password = 'password';
		await component.signUp();

		expect(component.displayInvalidUsernameMessage).toBeTrue();
	});

	it('should display invalid username message if username is whitespace', async () => {
		component.username = '    ';
		component.password = 'password';
		await component.signUp();

		expect(component.displayInvalidUsernameMessage).toBeTrue();
	});

	it('should display invalid username message if password is empty', async () => {
		component.username = 'username';
		component.password = '';
		await component.signUp();

		expect(component.displayInvalidPasswordMessage).toBeTrue();
	});

	it('should display invalid username message if username is whitespace', async () => {
		component.username = 'username';
		component.password = '    ';
		await component.signUp();

		expect(component.displayInvalidPasswordMessage).toBeTrue();
	});

	it('should display non matching password message if passwords dont match', async () => {
		component.username = 'username';
		component.password = 'test1';
		component.passwordConfirm = 'test2';
		await component.signUp();

		expect(component.displayNonMatchingPasswords).toBeTrue();
	});

	it('should send the username and password to the API if they are both correct', async () => {
		usersServiceSpy.createAccount.and.resolveTo({
			data: 1,
			errors: [],
			isSuccess: true
		});

		component.username = 'username';
		component.password = 'password';
		component.passwordConfirm = 'password';

		await component.signUp();

		expect(usersServiceSpy.createAccount).toHaveBeenCalledWith('username', 'password');
	});
});