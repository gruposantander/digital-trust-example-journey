import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SDKService } from '../../services/sdk.service';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.scss'],
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ 'position': 'relative', 'top': '1000px' }),
        animate('0.4s ease-in-out', style({ 'position': 'relative', 'top': '0' }))
      ])
    ]),
    trigger('scrim', [
      transition(':enter', [
        style({ 'opacity': '0' }),
        animate('0.4s ease-in-out', style({ 'opacity': '0.4' }))
      ])
    ]),
    trigger('header', [
      transition(':enter', [
        style({ 'opacity': '0' }),
        animate('0.4s ease-in-out', style({ 'opacity': '1' }))
      ])
    ])
  ]
})
export class VerifiedComponent {
  public _verified: boolean;

  @Input()
  set verified(val: boolean) {
    this._verified = val;
  }
}
