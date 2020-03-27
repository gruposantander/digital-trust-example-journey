import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('notifications', [transition(':enter', [
      style({ 'opacity': '0' }),
      animate('0.2s ease-in-out', style({ 'opacity': '1' }))
    ])]),
    trigger('notifications', [transition(':leave', [
      style({ 'opacity': '1' }),
      animate('0.2s ease-in-out', style({ 'opacity': '0' }))
    ])]),
  ]
})
export class AppComponent {
  public viewNotifications = false;

  public clickNotifications(): void {
    this.viewNotifications = !this.viewNotifications;
  }
}
