import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/@core/models/product.model';
import { ProductService } from 'src/app/@core/services/apis/product.service'; // Service to fetch products

interface Review {
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface VariantOption {
  name: string;
  key: string;
  options: string[];
}

type ProductDetail = Product & { product_id?: number; product_specs?: any };

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product: ProductDetail | null = null;
  isLoading = true; // Used for loading state
  rating = 0;
  variants: VariantOption[] = [
    { name: 'Màu sắc', key: 'color', options: ['Đen', 'Trắng'] },
    { name: 'Bộ nhớ', key: 'storage', options: ['64GB', '128GB'] },
  ];
  selectedVariant: Record<string, string> = {};
  reviews: Review[] = [
    { userName: 'Nguyễn Văn A', rating: 5, comment: 'Sản phẩm rất tốt!', createdAt: new Date() },
    { userName: 'Trần Thị B', rating: 4, comment: 'Đáng tiền.', createdAt: new Date() },
  ];
  newReview = { comment: '' };

  _paging = {
    pageIndex: 1,
    pageSize: 5,
    totalItems: 2,
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService // Inject your service to fetch product data
  ) {}

  ngOnInit(): void {
    // Get product ID from the URL
    this.route.params.subscribe(params => {
      this.productId = +params['id']; // Convert the id to a number
      this.fetchProductDetail();
    });
  }

  // Fetch product details by ID
  fetchProductDetail(): void {
    this.productService.getProductById(this.productId).subscribe(
      (data) => {
        this.product = data as ProductDetail; // Assign product data
        this.isLoading = false; // Stop loading once data is fetched
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching product details:', error);
        this.isLoading = false; // Stop loading on error
      }
    );
  }

  setRating(star: number): void {
    this.rating = star;
  }

  submitReview(): void {
    const comment = this.newReview.comment.trim();
    if (!comment) {
      return;
    }
    this.reviews.unshift({
      userName: 'Khách hàng',
      rating: this.rating || 5,
      comment,
      createdAt: new Date(),
    });
    this.newReview.comment = '';
    this._paging.totalItems = this.reviews.length;
  }

  onVariantChange(): void {
    // Placeholder for handling variant selection changes when data is available
  }

  onPageChange(event: number | { pageIndex: number; pageSize?: number }): void {
    if (typeof event === 'number') {
      this._paging.pageIndex = event;
      return;
    }
    this._paging.pageIndex = event.pageIndex;
    if (event.pageSize) {
      this._paging.pageSize = event.pageSize;
    }
  }

  formatPrice(value: number): string {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}
