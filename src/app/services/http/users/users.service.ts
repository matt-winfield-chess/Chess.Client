import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/classes/models/api-response';
import { ConfigService } from '../../config/config.service';

@Injectable({
	providedIn: 'root'
})
export class UsersService {

	constructor(private http: HttpClient, private configService: ConfigService) { }

	public async createAccount(username: string, password: string): Promise<ApiResponse<number>> {
		let url = this.configService.getApiEndpoint('USERS');
		return await this.http.post<ApiResponse<number>>(url, {
			username: username,
			password: password
		}).toPromise().catch(reason => {
			return reason.error;
		});
	}
}
