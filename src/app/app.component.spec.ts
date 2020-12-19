import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/gameplay/board/board.component';
import { SwUpdateMock } from './test-classes/sw-update-mock';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				ToastrModule.forRoot()
			],
			declarations: [
				AppComponent,
				BoardComponent
			],
			providers: [
				{ provide: SwUpdate, useValue: SwUpdateMock }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
