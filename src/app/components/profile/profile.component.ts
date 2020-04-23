import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SDKService } from '../../services/sdk.service';
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
  public displayVerifyLoader: boolean;
  public userDetails: any;
  public verified: boolean;
  public error = null;

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

      this.sdkService.extractData(code).subscribe(() => {
        setTimeout(() => {
          this.getVerified();

          setTimeout(() => {
            this.displayVerifyLoader = false;
            this.getUser();
          }, 1000);
        }, 1000);
      }, () => {
        setTimeout(() => {
          this.displayVerifyLoader = false;
          this.getUser();
        }, 1000);
      });
    }
  }

  private getUser(): void {
    this.userService.getUserDetails().subscribe(res =>
      this.userDetails = res
    );
  }

  private getVerified(): void {
    this.userService.getUserVerified().subscribe(
      () => this.verified = true,
      () => this.verified = false
    );
  }
}
