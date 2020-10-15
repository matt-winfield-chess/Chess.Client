import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../config/config.service';
import { LoginStateService } from '../login-state.service';
import { SignalRMethod } from './signal-r-method';

@Injectable({
	providedIn: 'root'
})
export abstract class SignalRService {
	private _hubConnection: HubConnection;
	private _hasStarted: boolean = false;
	private _hubStartPromise: Promise<boolean | void>;
	private _onConnectFailBehaviours: (() => void)[] = [];
	private _onDisconnectBehaviours: (() => void)[] = [];
	private _onReconnectingBehaviours: (() => void)[] = [];
	private _onReconnectedBehaviours: (() => void)[] = [];

	private _connectionAttemptCount = 1;
	private _maxConnectionAttempts = 5;

	constructor(private _configService: ConfigService, private spinner: NgxSpinnerService, private hubEndpointConfigName: string,
		private _loginStateService: LoginStateService) {
		this._hubConnection = this.buildConnection();
		this._hubConnection.onclose(() => this.onclose())
		this._hubConnection.onreconnecting(() => this.onreconnecting());
		this._hubConnection.onreconnected(() => this.onreconnected())
		this.startConnection();
	}

	public onConnectFail(newMethod: () => void) {
		this._onDisconnectBehaviours.push(newMethod);
	}

	public onDisconnect(newMethod: () => void) {
		this._onDisconnectBehaviours.push(newMethod);
	}

	public onReconnecting(newMethod: () => void) {
		this._onReconnectingBehaviours.push(newMethod);
	}

	public onReconnected(newMethod: () => void) {
		this._onReconnectedBehaviours.push(newMethod);
	}

	public onMethod(methodName: SignalRMethod, newMethod: (...args: any[]) => void): void {
		let errorHandledMethod = this.createErrorHandledSignalRMethod(newMethod);

		if (this._hasStarted) { // If already started just add the method
			this._hubConnection.on(methodName, errorHandledMethod)
		} else { // If not, add the subscription once finished loading
			this._hubStartPromise.then(() =>
				this._hubConnection.on(methodName, errorHandledMethod)
			);
		}
	}

	private buildConnection(): HubConnection {
		let hubUrl: string = this._configService.getApiEndpoint(this.hubEndpointConfigName);

		return new HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => this._loginStateService.getToken()
			})
			.withAutomaticReconnect()
			.build();
	}

	private startConnection(): void {
		this.spinner.show();
		this._hubStartPromise = this._hubConnection
			.start()
			.then(() => {
				this._hasStarted = true;
				this.spinner.hide();
			})
			.catch(error => {
				console.warn("Error while starting connection: " + error);

				if (this._connectionAttemptCount++ < this._maxConnectionAttempts) {
					setTimeout(() => this.startConnection(), 3000);
				} else {
					console.error("Failed to connect after " + this._connectionAttemptCount + " attempts")
					this._onConnectFailBehaviours.forEach(onConnectFailBehaviour => {
						onConnectFailBehaviour();
					});
				}
			});
	}

	private onclose(): void {
		console.error("SignalR disconnected!");
		this._onDisconnectBehaviours.forEach(disconnectBehaviour => {
			disconnectBehaviour();
		});
	}

	private onreconnecting(): void {
		console.warn("SignalR connection lost, reconnecting");
		this._onReconnectingBehaviours.forEach(reconnectingBehaviour => {
			reconnectingBehaviour();
		});
	}

	private onreconnected(): void {
		console.log("Reconnected to SignalR");
		this._onReconnectedBehaviours.forEach(reconnectedBehaviour => {
			reconnectedBehaviour();
		});
	}

	private createErrorHandledSignalRMethod(newMethod: (...args: any[]) => void): (...args: any[]) => void {
		return (...args) => {
			try {
				newMethod(...args)
			} catch (e) {
				console.error('ERROR in SignalR method:', e);
			}
		}
	}
}
