import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private loaded: boolean = false;
	private config: Object;
	private hostApi: string;
	private apiEndpoints: Object;

	constructor(private http: HttpClient) { }

	public async load(): Promise<void> {
		this.config = await this.http.get('./assets/config/' + environment.config + '.json').toPromise();

		this.hostApi = this.config['HOST_API'];
		this.apiEndpoints = this.config['API_ENDPOINTS'];
		this.loaded = true;
	}

	public getHost(): string {
		if (!this.loaded) throw new Error('Config not loaded!');
		return this.hostApi;
	}

	public getApiEndpoint(endpointName: string): string {
		if (!this.loaded) throw new Error('Config not loaded!');
		return this.hostApi + this.apiEndpoints[endpointName];
	}
}
