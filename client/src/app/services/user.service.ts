import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Naye server.js ke mutabik path /api/v1 se shuru hoga
  private apiUrl = 'https://wastezero-app-1.onrender.com/api/v1'; 

  constructor(private http: HttpClient) {}

  getVolunteers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/volunteers`);
  }

  login(credentials: any): Observable<any> {
    // server.js mein authRoutes /api/v1 par mounted hain
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
