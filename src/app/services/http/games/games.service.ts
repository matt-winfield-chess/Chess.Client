import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/classes/models/api-response';
import { Game } from 'src/app/classes/models/game';
import { ConfigService } from '../../config/config.service';
import { LoginStateService } from '../../login-state.service';

@Injectable({
	providedIn: 'root'
})
export class GamesService {

	constructor(private http: HttpClient, private configService: ConfigService, private loginStateService: LoginStateService) { }

	public async getGame(gameId: string): Promise<ApiResponse<Game>> {
		let url = this.configService.getApiEndpoint('GET_GAME');
		url += `/${gameId}`;

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.get<ApiResponse<Game>>(url, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async getActiveGames(): Promise<ApiResponse<Game[]>> {
		let url = this.configService.getApiEndpoint('ACTIVE_GAMES');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.get<ApiResponse<Game[]>>(url, { headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async resign(gameId: string): Promise<ApiResponse<boolean>> {
		let url = this.configService.getApiEndpoint('RESIGN');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.patch<ApiResponse<boolean>>(url,
			{ gameId },
			{ headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async offerDraw(gameId: string): Promise<ApiResponse<boolean>> {
		let url = this.configService.getApiEndpoint('OFFER_DRAW');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.patch<ApiResponse<boolean>>(url,
			{ gameId },
			{ headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async acceptDraw(gameId: string): Promise<ApiResponse<boolean>> {
		let url = this.configService.getApiEndpoint('ACCEPT_DRAW');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.patch<ApiResponse<boolean>>(url,
			{ gameId },
			{ headers })
			.toPromise()
			.catch(reason => reason.error);
	}

	public async declineDraw(gameId: string): Promise<ApiResponse<boolean>> {
		let url = this.configService.getApiEndpoint('DECLINE_DRAW');

		let headers = new HttpHeaders({ Authorization: `Bearer ${this.loginStateService.getToken()}` });

		return this.http.patch<ApiResponse<boolean>>(url,
			{ gameId },
			{ headers })
			.toPromise()
			.catch(reason => reason.error);
	}
}
