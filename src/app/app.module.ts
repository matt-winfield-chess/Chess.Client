import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/gameplay/board/board.component';
import { PieceComponent } from './components/gameplay/piece/piece.component';
import { NavbarComponent } from './components/navigation/navbar/navbar.component';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { ThemeComponent } from './components/theming/theme/theme.component';

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		PieceComponent,
		NavbarComponent,
		CreateAccountPageComponent,
		HomePageComponent,
		GamePageComponent,
		ThemeComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
