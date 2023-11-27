import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashComponent } from './Pages/splash/splash.component';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { AuthComponent } from './Pages/auth/auth.component';

const routes: Routes = [
  {
    path: 'inicio', component: AuthComponent
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'splash', component:SplashComponent
  },
  {
    path: 'principal', component: PrincipalComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
