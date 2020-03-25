import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotificatonsComponent } from './components/notificatons/notificatons.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'notifications', component: NotificatonsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
