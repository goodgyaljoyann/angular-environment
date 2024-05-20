import { Component, OnInit, ChangeDetectorRef, Renderer2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  showCart: boolean = true;

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Additional initialization if needed
  }

  ngAfterViewInit(): void {
    const iframe = this.renderer.selectRootElement('#adVideoIframe') as HTMLIFrameElement;

    // Ensure the iframe content is ready
    iframe.onload = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        // Create a video element
        const videoElement = doc.createElement('video');
        videoElement.src = 'assets/Ad.mp4';
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true; // Optional: mute the video
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';

        // Remove controls from the video
        videoElement.controls = false;

        // Append the video element to the iframe's body
        doc.body.appendChild(videoElement);
      }
    };

    // Set the iframe to a blank page initially
    iframe.src = 'about:blank';
  }

  get cart(): any[] {
    return this.cartService.getCart();
  }

  calculateCartTotal(): number {
    return this.cartService.calculateCartTotal();
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartToLocalStorage();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToLocalStorage();
    }
  }

  saveCartToLocalStorage(): void {
    this.cartService.saveCartToLocalStorage();
  }

  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.cartService.removeFromCart(itemId, itemType);
    if (this.cartService.getCart().length === 0) {
      this.showCart = false;
    }
    this.cdr.detectChanges();
  }

  checkout(): void {
    this.router.navigate(['/payments']);
  }
}
