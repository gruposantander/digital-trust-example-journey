import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Config } from '../models/config.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SDKService {
  public verified = false;

  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) { }

  public getRequestUri(): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) =>
      this.http.get(`${config.apiBaseUrl}/initiate-authorize`).pipe(take(1))
    ));
  }

  public extractData(code: string): Observable<any> {
    return this.configService.getConfig().pipe(switchMap((config: Config) =>
      this.http.post(`${config.apiBaseUrl}/token`, { code: code }).pipe(tap(() => this.verified = true))
    ));
  }
}
