import { Product } from '@/products/interfaces/product.interface';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { FormErrorLabelComponent } from "@/store-front/components/form-error-label/form-error-label.component";
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);
  router = inject(Router);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', [Validators.required], []],
    description: ['', [Validators.required], []],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
      [],
    ],
    price: [0, [Validators.required, Validators.min(0)], []],
    stock: [0, [Validators.required, Validators.min(0)], []],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
      [],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product() as any);
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(formLike as any);
    this.productForm.patchValue({tags: formLike.tags?.join(', ')});
  }

  onSizeClicked(size: string) {
    const currentSizes: string[] = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    console.log(this.productForm.value, { isValid });
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const productLike: Partial<Product> = {
      ...(this.productForm.value as any),
      tags: this.productForm.value.tags?.toLowerCase().split(',').map( t => t.trim() ) ?? []
    };

    if ( this.product().id === 'new' ) {
      const product = await firstValueFrom( this.productsService.createProduct( productLike ) );
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom( this.productsService.updateProduct(this.product().id, productLike) );
    }
    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);




  }
}
