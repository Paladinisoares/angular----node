import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBreweries(page: number, perPage: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `${token}`,
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any[]>(`${this.apiURL}/beers`, { headers, params });
  }
}
