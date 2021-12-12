import { Component } from '@angular/core';

import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-region',
  templateUrl: './by-region.component.html',
  styles: [
    `
      button {
        margin-right: 5px;
      }
    `,
  ],
})
export class ByRegionComponent {
  regions: string[] = [
    'eu',
    'efta',
    'caricom',
    'pa',
    'au',
    'usan',
    'eeu',
    'al',
    'asean',
    'cais',
    'cefta',
    'nafta',
    'saarc',
  ];

  activeRegion: string = '';
  countries: Country[] = [];

  constructor(private countyService: CountryService) {}

  getCSSClass(region: string): string {
    return region === this.activeRegion
      ? 'btn btn-primary'
      : 'btn btn-outline-primary';
  }

  activateRegion(region: string) {
    if (region === this.activeRegion) {
      return;
    }

    this.activeRegion = region;
    this.countries = [];
    
    this.countyService
      .findRegion(region)
      .subscribe((countries) => (this.countries = countries));
  }
}
