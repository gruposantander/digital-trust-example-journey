import { Component } from '@angular/core';
import { SDKService } from '../../../services/sdk.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent {
  constructor(private readonly sdkService: SDKService) { }

  verifyUser(): void {
    this.sdkService.getRequestUri();
  }
}
