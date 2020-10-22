import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { ApiResponse } from '../../../classes/models/api-response';
import { LoginResponse } from '../../../classes/models/login-response';

@Injectable({
	providedIn: 'root'
})
export class AuthenticateService {

	constructor(private http: HttpClient, private configService: ConfigService) { }

	public async logIn(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
		let url = this.configService.getApiEndpoint('AUTHENTICATE');
		return await this.http.post<ApiResponse<LoginResponse>>(url, {
			username,
			password
		}).toPromise().catch(reason => {
			return reason.error;
		});
	}
}
