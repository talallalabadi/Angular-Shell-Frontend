import { Injectable } from '@angular/core';
import type { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import type { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // Attach jwt token to packet if we own one
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem('id_token');

        if (idToken) {
            // Don't add Bearer prefix if it's already there
            const token = idToken.startsWith('Bearer ') ? idToken : `Bearer ${idToken}`;

            const cloned = req.clone({
                headers: req.headers.set('Authorization', token)
            });
            return next.handle(cloned);
        }
        return next.handle(req);
    }
}
