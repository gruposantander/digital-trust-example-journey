import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) { }

  public getUserDetails(): Observable<any> {
    return this.http.get('http://localhost:8000/user-info').pipe(map(res => res), take(1));
  }

  public getUserVerified(): Observable<any> {
    return this.http.get('http://localhost:8000/verified').pipe(
      map(res => res),
      take(1),
      catchError(err => throwError(err)));
  }
}
