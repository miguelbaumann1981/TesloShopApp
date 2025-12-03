import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/auth.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const BASE_URL = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

    private http = inject(HttpClient);
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    checkStatusResource = rxResource({
        params: () => ({}),
        stream: () => this.checkStatus(),
    });


    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) return 'authenticated';
        
        return 'not-authenticated';
    });

    user = computed<User | null>(() => this._user());
    token = computed<string | null>(() => this._token());
    isAdmin = computed<boolean>(() => this._user()?.roles.includes('admin') ?? false);

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, { email, password })
            .pipe(
                map(resp => this.handleAuthSuccess(resp)),
                catchError((error: any) => this.handleAuthError(error))
            );      
    }

    register(fullName: string, email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/register`, { fullName, email, password });      
    }


    checkStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }
        return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`)
            .pipe(
                map(resp => this.handleAuthSuccess(resp)),
                catchError((error: any) => this.handleAuthError(error))
            );
    }


    logout(): void {
        this._authStatus.set('not-authenticated');
        this._user.set(null);
        this._token.set(null);
        localStorage.removeItem('token');
    }


    private handleAuthSuccess(resp: AuthResponse) {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);
        localStorage.setItem('token', resp.token); 
        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }


}