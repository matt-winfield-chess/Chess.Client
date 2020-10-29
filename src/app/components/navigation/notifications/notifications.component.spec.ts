import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from 'src/app/services/config/config.service';
import { NavbarButtonComponent } from '../navbar-button/navbar-button.component';

import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
	let component: NotificationsComponent;
	let fixture: ComponentFixture<NotificationsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationsComponent, NavbarButtonComponent],
			imports: [HttpClientModule, RouterTestingModule],
			providers: [
				{ provide: ConfigService, useValue: jasmine.createSpyObj('ConfigService', ['getHost', 'getApiEndpoint', 'load']) }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
