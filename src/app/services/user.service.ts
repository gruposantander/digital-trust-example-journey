import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Config } from '../models/config.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) { }

  public getUserDetails(): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) =>
      this.http.get(`${config.apiBaseUrl}/user-info`).pipe(take(1))
    ));
  }

  public getUserVerified(): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) =>
      this.http.get(`${config.apiBaseUrl}/verified`).pipe(take(1))
    ));
  }
}
