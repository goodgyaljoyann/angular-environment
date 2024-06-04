import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cart: any[] = [];

  constructor(private snackBar: MatSnackBar) {
    this.loadCartFromLocalStorage();
  }

  
  addToCart(item: any, itemType: 'service' | 'product'): void {
    if (itemType === 'service' && this.countServicesInCart() >= 1) {
      this.snackBar.open('You cannot book more than 1 service at a time.', 'Close', {
        duration: 3000, // Duration in milliseconds
        verticalPosition: 'top', // 'top' or 'bottom'
        horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      });
      return;
    }

    const existingItem = this.cart.find(cartItem => cartItem.item[itemType + '_id'] === item[itemType + '_id']);
    if (!existingItem) {
      this.cart.push({ item, itemType, quantity: 1 });
      this.saveCartToLocalStorage();
    }
  }

  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.cart = this.cart.filter(cartItem => cartItem.item[itemType + '_id'] !== itemId);
    this.saveCartToLocalStorage();
  }

  getCart(): any[] {
    return this.cart;
  }

  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  calculateCartTotal(): number {
    return this.cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  }

  private countServicesInCart(): number {
    return this.cart.filter(cartItem => cartItem.itemType === 'service').length;
  }

   // Add the clearCart method
   clearCart(): void {
    this.cart = [];
    this.saveCartToLocalStorage();
  }
}
