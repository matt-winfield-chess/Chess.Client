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
import { ThemeComponent } from './components/theming/theme/theme.component';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './services/config/config.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export function load(config: ConfigService) {
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
		ThemeComponent,
	],
	imports: [
		CommonModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot()
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
