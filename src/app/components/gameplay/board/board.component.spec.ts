import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PieceComponent } from '../piece/piece.component';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
	let component: BoardComponent;
	let fixture: ComponentFixture<BoardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BoardComponent, PieceComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BoardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// Clean up tests so that they don't overlay results
	afterEach(() => {
		if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
			(fixture.nativeElement as HTMLElement).remove();
		}
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should position tiles correctly', () => {
		expect(component.getTilePositioning(0)).toBe('0%');
		expect(component.getTilePositioning(1)).toBe('12.5%');
		expect(component.getTilePositioning(7)).toBe('87.5%');
	});

	it('should render light/dark squares in the correct position (top left)', () => {
		expect(component.isDarkSquare(0, 0)).toBeFalse();
	});

	it('should render light/dark squares in the correct position (top right)', () => {
		expect(component.isDarkSquare(7, 0)).toBeTrue();
	});

	it('should render light/dark squares in the correct position (bottom left)', () => {
		expect(component.isDarkSquare(0, 7)).toBeTrue();
	});

	it('should render light/dark squares in the correct position (bottom right)', () => {
		expect(component.isDarkSquare(7, 7)).toBeFalse();
	});
});
