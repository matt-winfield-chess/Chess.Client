import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggleComponent } from './theme-toggle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

describe('ThemeToggleComponent', () => {
	let component: ThemeToggleComponent;
	let fixture: ComponentFixture<ThemeToggleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [MatSlideToggleModule],
			declarations: [ThemeToggleComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ThemeToggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
