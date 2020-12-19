import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { ToastPackage, ToastRef, ToastrModule } from 'ngx-toastr';
import { SwUpdateMock } from 'src/app/test-classes/sw-update-mock';

import { UpdateToastComponent } from './update-toast.component';

describe('UpdateToastComponent', () => {
	let component: UpdateToastComponent;
	let fixture: ComponentFixture<UpdateToastComponent>;

	let toastPackageMock = {
		toastId: 1,
		toastType: 'success',
		afterActivate: jasmine.createSpy('afterActivate'),
		config: { toastClass: 'custom-toast' },
		message: 'test message',
		title: 'test title',
		toastRef: new ToastRef(null)
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UpdateToastComponent],
			imports: [ToastrModule.forRoot(), RouterTestingModule, BrowserAnimationsModule],
			providers: [
				{ provide: ToastPackage, useValue: toastPackageMock },
				{ provide: SwUpdate, useValue: SwUpdateMock }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateToastComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
