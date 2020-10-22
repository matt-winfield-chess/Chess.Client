import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/classes/models/api-response';
import { Challenge } from 'src/app/classes/models/challenge';
import { ChallengerColor } from 'src/app/enums/challenger-color.enum';
import { ConfigService } from '../../config/config.service';
import { LoginStateService } from '../../login-state.service';
import { Game } from 'src/app/classes/models/game';

@Injectable({
	providedIn: 'root'
})
export class ChallengesService {

	constructor(private http: HttpClient, private configService: ConfigService, private loginStateService: LoginStateService) { }

	public async getChallenges(): Promise<ApiResponse<Challenge[]>> {
		let url = this.configService.getApiEndpoint('RECEIVED_CHALLENGES');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.get<ApiResponse<Challenge[]>>(url, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async deleteChallenge(challengerId: number, recipientId: number): Promise<ApiResponse<void>> {
		let url = this.configService.getApiEndpoint('DELETE_CHALLENGE');
		url += `/${challengerId}/${recipientId}`;

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.delete<ApiResponse<void>>(url, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async sendChallenge(username: string, challengerColor: ChallengerColor): Promise<ApiResponse<void>> {
		let url = this.configService.getApiEndpoint('SEND_CHALLENGE');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.post<ApiResponse<Challenge[]>>(url, {
			username,
			challengerColor
		}, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async acceptChallenge(challenge: Challenge): Promise<ApiResponse<Game>> {
		let url = this.configService.getApiEndpoint('ACCEPT_CHALLENGE');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return await this.http.post<ApiResponse<Game>>(url, {
			challengerId: challenge.challenger.id,
			recipientId: challenge.recipient.id
		}, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}
}
