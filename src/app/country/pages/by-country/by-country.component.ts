import { Component } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country',
  templateUrl: './by-country.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class ByCountryComponent {
  term: string = '';
  isError: boolean = false;
  countries: Country[] = [];
  suggestedCountries: Country[] = [];
  showSuggestions: boolean = false;

  constructor(private countryService: CountryService) {}

  find(term: string) {
    this.isError = false;
    this.term = term;

    this.countryService.findCountry(term).subscribe(
      (countries) => {
        this.isError = false;

        this.countries = countries;
      },
      (err) => {
        this.isError = true;
        this.countries = [];
      }
    );
  }
  suggestions(term: string) {
    this.isError = false;
    this.term = term;
    this.showSuggestions = true;

    this.countryService.findCountry(term).subscribe(
      (countries) => (this.suggestedCountries = countries.splice(0, 3)),
      (err) => (this.suggestedCountries = [])
    );
  }

  findSuggested(term: string) {
    this.find(term);
  }
}
