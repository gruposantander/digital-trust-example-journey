import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotificatonsComponent } from './components/homepage/notificatons/notificatons.component';
import { ModalComponent } from './components/homepage/notificatons/modal/modal.component';
import { VerificationComponent } from './components/homepage/notificatons/verification/verification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotificatonsComponent,
    ModalComponent,
    VerificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
