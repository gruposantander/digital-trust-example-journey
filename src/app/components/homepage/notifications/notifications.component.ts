import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  public showNotifications = true;
  public showModal = false;

  public openModal(): void {
    this.showModal = !this.showModal;
    this.showNotifications = !this.showNotifications;
  }
}
