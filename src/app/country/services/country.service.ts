import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl: string = 'https://restcountries.com/v2';

  get httpParams() {
    return new HttpParams().set(
      'fields',
      'name,capital,alpha2Code,flag,population'
    );
  }

  constructor(private http: HttpClient) {}

  findCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.http.get<Country[]>(url,{params: this.httpParams});
  }

  findCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.http.get<Country[]>(url, {params: this.httpParams});
  }

  getCountryByCode(id: string) {
    const url = `${this.apiUrl}/alpha/${id}`;
    return this.http.get<Country>(url);
  }

  findRegion(region: string) {
    const url = `${this.apiUrl}/regionalbloc/${region}`;
    return this.http
      .get<Country[]>(url, {params: this.httpParams})

      .pipe(tap(console.log));
  }
}
