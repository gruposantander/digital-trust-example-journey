import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notificatons',
  templateUrl: './notificatons.component.html',
  styleUrls: ['./notificatons.component.scss']
})
export class NotificatonsComponent {
  public showNotifications = true;
  public showModal = false;

  public openModal(): void {
    this.showModal = !this.showModal;
    this.showNotifications = !this.showNotifications;
  }
}
