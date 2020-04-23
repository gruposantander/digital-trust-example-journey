import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SDKService } from './services/sdk.service';
import { UserService } from './services/user.service';

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

  constructor(
    public readonly sdkService: SDKService,
    private readonly router: Router,
    private readonly userService: UserService
  ) { }

  public clickNotifications(): void {
    this.userService.reset().subscribe(() => this.viewNotifications = !this.viewNotifications);
  }

  public clickProfile(): void {
    this.router.navigate(['/profile']);
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
