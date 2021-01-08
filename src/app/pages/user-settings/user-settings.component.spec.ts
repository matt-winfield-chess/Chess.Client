import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
	let component: UserSettingsComponent;
	let fixture: ComponentFixture<UserSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, ToastrModule.forRoot()],
			declarations: [UserSettingsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
