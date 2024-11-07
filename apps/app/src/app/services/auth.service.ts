import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _router = inject(Router);

  private _baseUrl = `${environment.baseUrl}/auth`;

  signUp(
    name: string,
    email: string,
    password: string,
    username: string
  ): Observable<User> {
    return this._http.post<User>(`${this._baseUrl}/signup`, {
      name,
      email,
      password,
      username,
    });
  }

  login(username: string, password: string): Observable<HttpResponse<User>> {
    return this._http.post<User>(
      `${this._baseUrl}/signin`,
      {
        username,
        password,
      },
      {
        observe: 'response',
        withCredentials: true,
      }
    );
  }

  refreshToken(): Observable<void> {
    return this._http.post<void>(`${this._baseUrl}/refresh`, null, {
      headers: {
        Authorization: localStorage.getItem('hop_token')!,
      },
      withCredentials: true,
    });
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this._http
      .get<boolean>(`${this._baseUrl}/availability/${username}`, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return res.status === 200;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this._http.get<User>(`${this._baseUrl}/me`, {
      headers: {
        Authorization: localStorage.getItem('hop_token')!,
      },
    });
  }
}
