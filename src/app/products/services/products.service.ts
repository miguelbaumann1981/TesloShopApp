import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/auth.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp))
      );
  }


  getProductByIdSlug(slug: string): Observable<Product>  {
    if (this.productCache.has(slug)) {
      return of(this.productCache.get(slug)!);
    }

    return this.http.get<Product>(`${BASE_URL}/products/${slug}`)
      .pipe(
        tap((resp) => console.log(resp)),
        tap((product) => this.productCache.set(slug, product))
      );
  }

  getProductById(id: string): Observable<Product>  {
    if (id === 'new') {
      return of( emptyProduct );
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${id}`)
  }


  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${BASE_URL}/products/${id}`, productLike)
      .pipe(
        tap( updatedProduct =>  this.updateProductCache(updatedProduct))
      );
  }


  updateProductCache(product: Product) {
    const id = product.id;
    this.productCache.set(id, product);

    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map( currentProduct => {
          return currentProduct.id === id ? product : currentProduct;
      })
    })
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${BASE_URL}/products`, productLike)
      .pipe(
        tap( updatedProduct =>  this.updateProductCache(updatedProduct))
      );
  }


}
