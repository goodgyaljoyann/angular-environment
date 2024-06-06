import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  //Declare variables
  private cart: any[] = [];

  constructor(private snackBar: MatSnackBar) {
    this.loadCartFromLocalStorage();
  }

  //Function to add a new service to cart
  addToCart(item: any, itemType: 'service' | 'product'): void {
    if (itemType === 'service' && this.countServicesInCart() >= 1) {//Checks number of services in cart if greater than 1
      this.snackBar.open('You cannot book more than 1 service at a time.', 'Close', {
        duration: 3000, // Duration in milliseconds
        verticalPosition: 'top', // 'top' or 'bottom'
        horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      });
      return;
    }
    
    //Checks if item exists in cart, if not, pushes item to cart
    const existingItem = this.cart.find(cartItem => cartItem.item[itemType + '_id'] === item[itemType + '_id']);
    if (!existingItem) {
      this.cart.push({ item, itemType, quantity: 1 });
      this.saveCartToLocalStorage();
    }
  }
  //Function that removes an item from cart
  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.cart = this.cart.filter(cartItem => cartItem.item[itemType + '_id'] !== itemId);
    this.saveCartToLocalStorage();
  }
  //Function that gets cart
  getCart(): any[] {
    return this.cart;
  }
  
  //Stores items added to cart to local storage
  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }
  
  //Gets items added to cart from local storage
  loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }
  
  //Calculates the total of items in the cart
  calculateCartTotal(): number {
    return this.cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
  }
  
  //Checks the number of services in the cart
  private countServicesInCart(): number {
    return this.cart.filter(cartItem => cartItem.itemType === 'service').length;
  }

   // Add the clearCart method
   clearCart(): void {
    this.cart = [];
    this.saveCartToLocalStorage();
  }
}
