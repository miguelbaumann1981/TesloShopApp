import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [
    ProductCarouselComponent
  ],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  productIdSlug = inject(ActivatedRoute).snapshot.paramMap.get('idSlug');
  productsService = inject(ProductsService);
  

  productResource = rxResource({
      params: () => ({idSlug: this.productIdSlug}),
      stream: ({params}) => {
        return this.productsService.getProductByIdSlug(params.idSlug!);
      }
    });


 }
