import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';    
import { Observable, throwError } from 'rxjs';
import { map, take, catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) { }

  public getUserDetails(): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) => {
      return this.http.get(`${config.apiBaseUrl}/user-info`).pipe(map(res => res), take(1));
    }))
  }

  public getUserVerified(): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) => {
      return this.http.get(`${config.apiBaseUrl}/verified`).pipe(
        map(res => res),
        take(1),
        catchError(err => throwError(err)));
    }))
  }
}
