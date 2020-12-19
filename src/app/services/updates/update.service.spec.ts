import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';

import { UpdateService } from './update.service';
import { SwUpdateMock } from 'src/app/test-classes/sw-update-mock';
import { ToastrModule } from 'ngx-toastr';

describe('UpdateService', () => {
	let service: UpdateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				ToastrModule.forRoot()
			],
			providers: [
				{ provide: SwUpdate, useValue: SwUpdateMock }
			]
		});
		service = TestBed.inject(UpdateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
