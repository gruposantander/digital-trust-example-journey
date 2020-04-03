import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  public showNotifications = true;
  public showModal = false;

  constructor(private readonly router: Router) { }

  public goToProfile(): void {
    this.showNotifications = !this.showNotifications;
    this.router.navigate(['/profile']);
  }
}
