import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Interfaces
import { Country, CountrySmall } from '../interfaces/countries.interfaces';

// RXJS
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CountriesService {

  private _url: string = 'https://restcountries.eu/rest/v2';
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  /**
   * Obtener los paises por Región.
  */
  public getCountriesByRegion(region: string): Observable<CountrySmall[]> {
    return this.http.get<CountrySmall[]>(`${ this._url }/region/${ region }?fields=alpha3Code;name`);
  }
  
  /**
   * Obtener el Pais por AlphaCode.
  */
  public getCountryByCode(code: string): Observable<Country | null> {
    if (!code) {
      return of(null);
    }

    return this.http.get<Country>(`${ this._url }/alpha/${ code }`);
  }

  /**
   * Obtener el Pais por AlphaCode - Formato Pequeño.
  */
   public getCountryByCodeSmall(code: string): Observable<CountrySmall> {
    return this.http.get<CountrySmall>(`${ this._url }/alpha/${ code }?fields=alpha3Code;name`);
  }

  /**
   * Obtenemos el Pais con formato pequeño
   * Realizamos multiples peticiones.
  */
  public getCountriesByCode(borders: string[]): Observable<CountrySmall[]> {
    if (!borders) {
      return of([]);
    }

    const requestCountries: Observable<CountrySmall>[] = [];

    borders.forEach(code => {
      const r = this.getCountryByCodeSmall(code);
      requestCountries.push(r);
    });

    return combineLatest(requestCountries);
  }

}
