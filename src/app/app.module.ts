import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { SplashComponent } from './Pages/splash/splash.component';
import { PrincipalComponent } from './Pages/principal/principal.component';
import { AuthComponent } from './Pages/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    PrincipalComponent,
    AuthComponent
  ],
  imports: [BrowserModule,
  IonicModule.forRoot(),
  AppRoutingModule,
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  FormsModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  RouterModule,
  ToastrModule.forRoot(),
  AngularFireModule.initializeApp(environment.firebase),

],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
