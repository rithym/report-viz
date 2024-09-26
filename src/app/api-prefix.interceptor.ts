import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    
    // Clone the request to add the authorization header if a token exists
    if (token) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      request = request.clone({ headers });
    }

    return next.handle(request);
  }
}
