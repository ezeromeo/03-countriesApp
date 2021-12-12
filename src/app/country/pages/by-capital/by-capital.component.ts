import { Component } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country',
  templateUrl: './by-capital.component.html',
  styles: [],
})
export class ByCapitalComponent {
  term: string = '';
  isError: boolean = false;
  countries: Country[] = [];

  constructor(private countryService: CountryService) {}

  find(term: string) {
    this.isError = false;
    this.term = term;

    this.countryService.findCapital(term).subscribe(
      (countries) => {

        this.countries = countries;
      },
      (err) => {
        this.isError = true;
        this.countries = [];
      }
    );
  }

}
