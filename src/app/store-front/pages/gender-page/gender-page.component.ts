import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Product } from '@/products/interfaces/product.interface';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCardComponent,
    TitleCasePipe,
    PaginationComponent
  ],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  activatedRoute = inject(ActivatedRoute);
  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  products = signal<Product[]>([]);

  productsResource = rxResource({
    params: () => ({ 
      gender: this.gender(),
      page: this.paginationService.currentPage() - 1
     }),
    stream: ({params}) => {
      return this.productsService.getProducts(
        { 
          gender: params.gender,
          offset: params.page * 9 
        });
    },
  });
}
