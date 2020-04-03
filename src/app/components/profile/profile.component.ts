import { Component, OnInit } from '@angular/core';
import { SDKService } from '../../services/sdk.service';
import { ActivatedRoute, Router } from '@angular/router';
import { transition, style, animate, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('verifyLoader', [
      transition(':leave', [
        style({ 'opacity': '1' }),
        animate('0.4s ease-in-out', style({ 'opacity': '0' }))
      ]),
    ]),
    trigger('verified', [
      transition(':enter', [
        style({ 'transform': 'scale(0)' }),
        animate('0.7s ease-in-out', style({ 'transform': 'scale(1)' }))
      ]),
    ]),
  ]
})
export class ProfileComponent implements OnInit {
  public displayVerifyLoader;
  public userDetails: string[];
  public verified: boolean;

  constructor(
    public readonly sdkService: SDKService,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) { }

  public ngOnInit() {
    this.getUser();
    this.getVerified();

    const code = (this.activatedRoute.queryParams as unknown as { _value: { code: string } })._value.code;

    if (code) {
      this.displayVerifyLoader = true;
      this.router.navigate(['/profile']);

      this.sdkService.extractData(code).subscribe(res => {
        setTimeout(() => {
          this.getVerified();

          setTimeout(() => {
            this.displayVerifyLoader = false;
            this.getUser();
          }, 1000);
        }, 1000);
      });
    }
  }

  private getUser() {
    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    });
  }

  private getVerified() {
    this.userService.getUserVerified().subscribe(() => this.verified = true, () => this.verified = false);
  }
}
