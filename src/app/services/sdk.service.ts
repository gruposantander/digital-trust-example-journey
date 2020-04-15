import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class SDKService {
  private baseUrl = 'http://localhost:8000';
  public verified = false;

  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.configService.getConfig().pipe(switchMap((config: Config) => {
      return this.baseUrl = config.apiBaseUrl;
    }))
  }

  public getRequestUri(): void {
    
    this.http.get(`${this.baseUrl}/initiate-authorize`).subscribe((res: string) => {
      window.location.href = res;
    });
  }

  public extractData(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/token`, { code: code }).pipe(tap(res => this.verified = true));
  }
}
