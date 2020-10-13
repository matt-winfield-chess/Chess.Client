import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private _loaded: boolean = false;
	private _config: Object;
	private _hostApi: string;
	private _apiEndpoints: Object;

	constructor(private http: HttpClient) { }

	public async load(): Promise<void> {
		this._config = await this.http.get('./assets/config/' + environment.config + '.json').toPromise();

		this._hostApi = this._config["HOST_API"];
		this._apiEndpoints = this._config["API_ENDPOINTS"];
		this._loaded = true;
	}

	public getHost(): string {
		if (!this._loaded) throw new Error("Config not loaded!");
		return this._hostApi;
	}

	public getApiEndpoint(endpointName: string) {
		if (!this._loaded) throw new Error("Config not loaded!");
		return this._hostApi + this._apiEndpoints[endpointName];
	}
}
