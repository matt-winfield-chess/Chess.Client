import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../config/config.service';
import { LoginStateService } from '../login-state.service';
import { SignalRMethod } from './signal-r-method';

@Injectable({
	providedIn: 'root'
})
export class SignalRService {
	protected hubConnection: HubConnection;
	private hasStarted: boolean = false;
	private hubStartPromise: Promise<boolean | void>;
	private onConnectFailBehaviours: (() => void)[] = [];
	private onDisconnectBehaviours: (() => void)[] = [];
	private onReconnectingBehaviours: (() => void)[] = [];
	private onReconnectedBehaviours: (() => void)[] = [];

	private connectionAttemptCount = 1;
	private maxConnectionAttempts = 5;

	constructor(private configService: ConfigService, private spinner: NgxSpinnerService, private hubEndpointConfigName: string,
		private loginStateService: LoginStateService) {
		this.hubConnection = this.buildConnection();
		this.hubConnection.onclose(() => this.onclose());
		this.hubConnection.onreconnecting(() => this.onreconnecting());
		this.hubConnection.onreconnected(() => this.onreconnected());
		this.startConnection();
	}

	public onConnectFail(newMethod: () => void): void {
		this.onDisconnectBehaviours.push(newMethod);
	}

	public onDisconnect(newMethod: () => void): void {
		this.onDisconnectBehaviours.push(newMethod);
	}

	public onReconnecting(newMethod: () => void): void {
		this.onReconnectingBehaviours.push(newMethod);
	}

	public onReconnected(newMethod: () => void): void {
		this.onReconnectedBehaviours.push(newMethod);
	}

	public onMethod(methodName: SignalRMethod, newMethod: (...args: any[]) => void): void {
		let errorHandledMethod = this.createErrorHandledSignalRMethod(newMethod);

		if (this.hasStarted) { // If already started just add the method
			this.hubConnection.on(methodName, errorHandledMethod);
		} else { // If not, add the subscription once finished loading
			this.hubStartPromise.then(() =>
				this.hubConnection.on(methodName, errorHandledMethod)
			);
		}
	}

	public reconnect(): void {
		this.connectionAttemptCount = 1;
		this.hubConnection.stop();
		this.startConnection();
	}

	private buildConnection(): HubConnection {
		let hubUrl: string = this.configService.getApiEndpoint(this.hubEndpointConfigName);

		return new HubConnectionBuilder()
			.withUrl(hubUrl, {
				accessTokenFactory: () => this.loginStateService.getToken()
			})
			.withAutomaticReconnect()
			.build();
	}

	private startConnection(): void {
		if (this.connectionAttemptCount == 1) {
			this.spinner.show();
		}

		this.hubStartPromise = this.hubConnection
			.start()
			.then(() => {
				this.hasStarted = true;
				this.spinner.hide();
			})
			.catch(error => {
				console.warn('Error while starting connection: ' + error);
				this.spinner.hide();

				if (this.connectionAttemptCount++ < this.maxConnectionAttempts) {
					setTimeout(() => this.startConnection(), 3000);
				} else {
					console.error(`Failed to connect after ${this.connectionAttemptCount} attempts`);
					this.onConnectFailBehaviours.forEach(onConnectFailBehaviour => {
						onConnectFailBehaviour();
					});
				}
			});
	}

	private onclose(): void {
		console.error('SignalR disconnected!');
		this.onDisconnectBehaviours.forEach(disconnectBehaviour => {
			disconnectBehaviour();
		});
	}

	private onreconnecting(): void {
		console.warn('SignalR connection lost, reconnecting');
		this.onReconnectingBehaviours.forEach(reconnectingBehaviour => {
			reconnectingBehaviour();
		});
	}

	private onreconnected(): void {
		console.log('Reconnected to SignalR');
		this.onReconnectedBehaviours.forEach(reconnectedBehaviour => {
			reconnectedBehaviour();
		});
	}

	private createErrorHandledSignalRMethod(newMethod: (...args: any[]) => void): (...args: any[]) => void {
		return (...args) => {
			try {
				newMethod(...args);
			} catch (e) {
				console.error('ERROR in SignalR method:', e);
			}
		};
	}
}
