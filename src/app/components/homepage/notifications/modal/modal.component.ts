import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('modal', [transition(':enter', [
      style({ 'opacity': '0' }),
      animate('0.2s ease-in-out', style({ 'opacity': '1' }))
    ])]),
    trigger('modal', [transition(':leave', [
      style({ 'opacity': '1' }),
      animate('0.2s ease-in-out', style({ 'opacity': '0' }))
    ])]),
    trigger('scrimAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease-in', style({ opacity: 0.6 }))
      ]),
      transition(':leave', [
        animate('0.2s 0.1s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {
  public openModal = true;
  public showVerificationSteps = false;
  public modalTop = 100;

  constructor() { }

  ngOnInit() {
  }

  public closeModal(): void {
    this.openModal = false;
  }

  public accept(): void {
    this.modalTop = 30;
    this.showVerificationSteps = true;
  }
}
