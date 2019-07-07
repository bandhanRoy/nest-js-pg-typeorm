import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  // products should be an array of Product
  products: Product[] = [];

  insertProduct(title: string, desc: string, price: number): string {
    const prodId = Math.random().toString();
    const newProduct = new Product(prodId, title, desc, price);
    this.products.push(newProduct);
    return prodId;
  }

  getProducts() {
    return [...this.products];
  }

  getSingleProduct(productId: string) {
    const product = this.findProduct(productId)[0];
    return { ...product };
  }

  updateProduct(
    productId: string,
    productTitle: string,
    productDesc: string,
    productPrice: number,
  ) {
    const [product, index] = this.findProduct(productId);
    const updatedProd = { ...product };
    if (productTitle) {
      updatedProd.title = productTitle;
    }
    if (productDesc) {
      updatedProd.description = productDesc;
    }
    if (productPrice) {
      updatedProd.price = productPrice;
    }
    this.products[index] = updatedProd;
  }

  removeProduct(prodId: string) {
    const index = this.findProduct(prodId)[1];
    const updatedProd = { ...this.products };
    updatedProd.splice(index);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(prod => prod.id === id);
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return [product, productIndex];
  }
}
