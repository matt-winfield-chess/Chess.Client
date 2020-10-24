import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/gameplay/board/board.component';
import { PieceComponent } from './components/gameplay/piece/piece.component';
import { NavbarComponent } from './components/navigation/navbar/navbar.component';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './services/config/config.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LogInComponent } from './pages/log-in/log-in.component';
import { PawnPromotionComponent } from './components/gameplay/pawn-promotion/pawn-promotion.component';
import { ChallengesComponent } from './components/navigation/challenges/challenges.component';
import { GameSettingsModalComponent } from './components/navigation/game-settings-modal/game-settings-modal.component';
import { SendChallengeModalComponent } from './components/navigation/send-challenge-modal/send-challenge-modal.component';
import { OfflineGamePageComponent } from './pages/offline-game-page/offline-game-page.component';
import { NavbarButtonComponent } from './components/navigation/navbar-button/navbar-button.component';
import { NotificationsComponent } from './components/navigation/notifications/notifications.component';

export function load(config: ConfigService): () => Promise<void> {
	return () => config.load();
}

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		PieceComponent,
		NavbarComponent,
		CreateAccountPageComponent,
		HomePageComponent,
		GamePageComponent,
		LogInComponent,
		PawnPromotionComponent,
		ChallengesComponent,
		GameSettingsModalComponent,
		SendChallengeModalComponent,
		OfflineGamePageComponent,
		NavbarButtonComponent,
		NotificationsComponent
	],
	imports: [
		CommonModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			progressBar: true,
			closeButton: true,
			positionClass: 'toast-top-center'
		}),
		NgxSpinnerModule
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: load,
			multi: true,
			deps: [ConfigService]
		}
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
