import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SDKService {

  constructor(private readonly http: HttpClient) {
  }

  public getRequestUri() {
    this.http.get('http://localhost:8000/initiate-authorize').subscribe((res: string) => {
      window.location.href = res;
    });
  }

  public extractData(code: string): { [key: string]: string } {
    return { a: 'a' };
  }
}
