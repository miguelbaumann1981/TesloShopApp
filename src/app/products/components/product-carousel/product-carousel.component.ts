import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

const BASE_API_URL = environment.baseUrl;

interface ImageSlide {
  url: string;
  title: string;
}

@Component({
  selector: 'product-carousel',
  imports: [
    CarouselModule ,
    ButtonModule,
  ],
  templateUrl: './product-carousel.component.html',
})
export class ProductCarouselComponent implements OnChanges { 

  images = input.required<string[]>();
  slides: ImageSlide[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      if (changes['images'].currentValue.length > 0) {
      this.slides = changes['images'].currentValue.map((img: any) => {
        return {
          url: `${BASE_API_URL}/files/product/${img}`,
          title: img,
        }
      })
    } else {
      this.slides = [
        {
          url: './assets/images/no-image.jpg',
          title: 'No image',
        }
      ];
    }
    }
  }




}
