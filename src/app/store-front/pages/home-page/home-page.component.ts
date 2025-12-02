import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Product } from '@/products/interfaces/product.interface';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject, resource, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "@/shared/components/pagination/pagination.component";
import { PaginationService } from '@/shared/components/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [
    ProductCardComponent,
    PaginationComponent
],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    products = signal<Product[]>([]);


    productsResource = rxResource({
      params: () => ({ page: this.paginationService.currentPage() - 1 }),
      stream: ({params}) => {
        return this.productsService.getProducts({
          offset: params.page * 9
        });
      }
    });




}


