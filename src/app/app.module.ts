import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/gameplay/board/board.component';
import { PieceComponent } from './components/gameplay/piece/piece.component';

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		PieceComponent
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
