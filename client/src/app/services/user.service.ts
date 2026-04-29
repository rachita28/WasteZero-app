import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Aapka Render Backend URL
  private apiUrl = 'https://wastezero-app-1.onrender.com/api/v1';

  constructor(private http: HttpClient) {}

  getVolunteers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/volunteers`);
  }

  login(credentials: any): Observable<any> {
    // Agar backend mein path /auth/login hai toh yahan badal dein
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  signup(userData: any): Observable<any> {
    // Aapke console error ke mutabik rasta '/auth/signup' hai
    return this.http.post(`${this.apiUrl}/auth/signup`, userData);
  }
}
