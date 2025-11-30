import { ProductImagePipe } from '@/products/pipes/product.pipe';
import { Component, input } from '@angular/core';
import { NgContentCarousel, ContentCarouselItemDirective } from 'ng-content-carousel';

@Component({
  selector: 'product-carousel',
  imports: [
    ProductImagePipe,
    NgContentCarousel, 
    ContentCarouselItemDirective
  ],
  templateUrl: './product-carousel.component.html'
})
export class ProductCarouselComponent { 

  images = input.required<string[]>();



}
