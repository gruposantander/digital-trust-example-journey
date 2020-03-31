import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { SDKService } from '../../services/sdk.service';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.scss']
})
export class VerifiedComponent implements OnInit {

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly sdkService: SDKService
  ) { }

  ngOnInit() {
    const code = (this.activatedRoute.queryParams as unknown as { _value: { code: string } })._value.code;
    this.sdkService.extractData(code);
  }

}
