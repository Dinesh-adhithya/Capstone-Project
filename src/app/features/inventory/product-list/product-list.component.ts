import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/data.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error fetching products.';
        this.loading = false;
      }
    });
  }

  onSearch(query: string): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  viewProduct(id: number): void {
    this.router.navigate([`/inventory/product-detail/${id}`]);
  }

  editProduct(id: number): void {
    this.router.navigate([`/inventory/update-product/${id}`]);
  }

  deleteProduct(id: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to delete a product!');
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    this.dataService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(product => product.id !== id);
      this.filteredProducts = this.filteredProducts.filter(product => product.id !== id);
    }, () => {
      alert('Error deleting product.');
    });
  }
}
