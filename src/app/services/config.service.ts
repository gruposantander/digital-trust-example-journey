import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, take } from 'rxjs/operators';
import { Config } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})

/**
 * Config service
 */
export class ConfigService {
  public config: Config;

  /**
   * Injectables
   * @param http Used to make Http requests
   */
  constructor(private readonly http: HttpClient) { }

  /**
   * Retrieves the locally stored config.json which contains the apiBaseUrl. This is overwritten in production
   * environments, as it points to a different endpoint.
   */
  public getConfig(): Observable<Config> {
    if (!this.config) {
      return this.http.get('assets/config/config.json').pipe(tap((conf: Config) => { this.config = conf; }), take(1));
    }
    return of(this.config);
  }
}
