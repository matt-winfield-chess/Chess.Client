import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from '../board/board.component';

import { PieceComponent } from './piece.component';

describe('PieceComponent', () => {
	let component: PieceComponent;
	let fixture: ComponentFixture<PieceComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PieceComponent, BoardComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PieceComponent);
		component = fixture.componentInstance;
		component.board = document.createElement('chess-board');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display in flipped position if flipBoard is set', () => {
		component.setFlipBoard(true);
		component.xCoord = 0;
		component.yCoord = 0;

		let result = component.getPieceTransform();

		expect(result).toBe('translate(700%, 700%)');
	});

	it('should set dragging when mouse starts clicking on piece', () => {
		component.onPieceMouseDown(new MouseEvent('click'));

		expect(component.isDragging).toBe(true);
	});

	it('should set dragging when touch starts on piece', () => {
		component.onPieceTouchStart(new TouchEvent('touch', {
			touches: [new Touch({
				identifier: 0,
				target: fixture.nativeElement
			})]
		}));

		expect(component.isDragging).toBe(true);
	});

	it('should stop dragging when mouse releases click', () => {
		component.onPieceMouseDown(new MouseEvent('click'));

		document.dispatchEvent(new Event('mouseup'));

		expect(component.isDragging).toBe(false);
	});
});
