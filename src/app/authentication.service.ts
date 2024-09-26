import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: any = environment.apiUrl
  // baseUrl: any = "https://be-reportvisualization.dev.elixirhr.com"

  constructor(private http: HttpClient) { }

  login(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers,
      responseType: 'text' as 'json',
    };

    return this.http.post(`${this.baseUrl}/api/Login`, data, options).pipe(
      catchError((error) => {
        console.error('Response Error:', error);
        return throwError(error);
      }),
      map((res: any) => {
        localStorage.setItem('token', res);
        return res;
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; 
  }
}
