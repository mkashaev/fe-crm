import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../intefaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = null;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.setToken(null);
    localStorage.clear();
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('api/auth/login', user).pipe(
      tap(
        ({ token }) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        },
        (err) => console.warn('Err: ', err)
      )
    );
  }
}
