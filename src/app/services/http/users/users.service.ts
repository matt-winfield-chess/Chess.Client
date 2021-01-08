import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/classes/models/api-response';
import { ConfigService } from '../../config/config.service';
import { LoginStateService } from '../../login-state.service';

@Injectable({
	providedIn: 'root'
})
export class UsersService {

	constructor(private http: HttpClient, private configService: ConfigService, private loginStateService: LoginStateService) { }

	public async createAccount(username: string, password: string): Promise<ApiResponse<number>> {
		let url = this.configService.getApiEndpoint('USERS');
		return await this.http.post<ApiResponse<number>>(url, {
			username,
			password
		}).toPromise().catch(reason => {
			return reason.error;
		});
	}

	public async getPieceMovementMethod(): Promise<ApiResponse<number>> {
		let url = this.configService.getApiEndpoint('PIECE_MOVEMENT_METHOD');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.get<ApiResponse<number>>(url,
			{ headers }
		)
			.toPromise()
			.catch(reason => {
				return reason.error;
			});
	}

	public async setPieceMovementMethod(movementMethod: number): Promise<ApiResponse<boolean>> {
		let url = this.configService.getApiEndpoint('PIECE_MOVEMENT_METHOD');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.post<ApiResponse<boolean>>(url + `/${movementMethod}`,
			null,
			{ headers }
		)
			.toPromise()
			.catch(reason => {
				return reason.error;
			});
	}
}
