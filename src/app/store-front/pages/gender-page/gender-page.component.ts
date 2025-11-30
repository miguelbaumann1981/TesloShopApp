import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { Product } from '@/products/interfaces/product.interface';
import { ProductsService } from '@/products/services/products.service';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCardComponent,
    TitleCasePipe
  ],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  activatedRoute = inject(ActivatedRoute);
  gender = toSignal(
    this.activatedRoute.params.pipe(map(({ gender }) => gender))
  );

  productsService = inject(ProductsService);

  products = signal<Product[]>([]);

  productsResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: () => {
      return this.productsService.getProducts({ gender: this.gender() });
    },
  });
}
