import { Component, OnInit } from '@angular/core';
import { BeerService } from '../service/beer.service';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.css'],
})
export class BeersComponent implements OnInit {
  breweries: any[] = [];
  currentPage = 1;
  perPage = 10;
  totalPages: number = 1; // Supondo que você pode ajustar isso se precisar

  constructor(private beerService: BeerService) {}

  ngOnInit(): void {
    this.loadBreweries();
  }

  loadBreweries(): void {
    this.beerService
      .getBreweries(this.currentPage, this.perPage)
      .subscribe((response: any) => {
        this.breweries = response.data;
        this.totalPages = Math.ceil(response.total / this.perPage);
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBreweries();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBreweries();
    }
  }
}
