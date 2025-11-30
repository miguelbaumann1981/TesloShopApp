import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Product, ProductsResponse } from '@/products/interfaces/product.interface';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject, resource, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [
    ProductCardComponent
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

    productsService = inject(ProductsService);

    products = signal<Product[]>([]);

    productsResource = rxResource({
      params: () => ({}),
      stream: () => {
        return this.productsService.getProducts({});
      }
    });




}


