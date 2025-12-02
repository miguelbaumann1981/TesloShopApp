import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/auth.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

    private http = inject(HttpClient);
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(null);


    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) return 'authenticated';
        
        return 'not-authenticated';
    });

    user = computed<User | null>(() => this._user());
    token = computed<string | null>(() => this._token());

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, { email, password })
            .pipe(
                tap(resp => {
                    this._authStatus.set('authenticated');
                    this._user.set(resp.user);
                    this._token.set(resp.token);

                    localStorage.setItem('token', resp.token);
                }),
                map(() => true),
                catchError((error: any) => {
                    this._authStatus.set('not-authenticated');
                    this._user.set(null);
                    this._token.set(null);
                    return of(false);
                })
            )
        ;
    }


}