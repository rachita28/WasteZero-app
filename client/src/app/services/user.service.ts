import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://wastezero-app-1.onrender.com'; 

  constructor(private http: HttpClient) {}

  getVolunteers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/volunteers`);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }
}
