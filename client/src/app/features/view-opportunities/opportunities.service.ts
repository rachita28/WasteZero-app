import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesService {
  private API_URL = 'https://wastezero-app-1.onrender.com/api/v1/opportunities';

  constructor(private http: HttpClient) {}

  getOpportunities(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }
}
