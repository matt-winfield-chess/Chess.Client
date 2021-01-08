import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAccountPageComponent } from './pages/create-account-page/create-account-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { OfflineGamePageComponent } from './pages/offline-game-page/offline-game-page.component';
import { ComputerGamePageComponent } from './pages/computer-game-page/computer-game-page.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';


const routes: Routes = [
	{ path: '', component: HomePageComponent },
	{ path: 'game/:id', component: GamePageComponent },
	{ path: 'offline-game', component: OfflineGamePageComponent },
	{ path: 'computer-game', component: ComputerGamePageComponent },
	{ path: 'create-account', component: CreateAccountPageComponent },
	{ path: 'log-in', component: LogInComponent },
	{ path: 'settings', component: UserSettingsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
