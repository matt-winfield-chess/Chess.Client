import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from 'src/app/services/config/config.service';

import { NavbarComponent } from './navbar.component';
import { MatMenuModule } from '@angular/material/menu';

describe('NavbarComponent', () => {
	let component: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MatMenuModule],
			declarations: [NavbarComponent],
			providers: [
				{ provide: ConfigService, useValue: jasmine.createSpyObj('ConfigService', ['getHost', 'getApiEndpoint', 'load']) }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NavbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
