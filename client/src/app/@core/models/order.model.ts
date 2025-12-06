export interface OrderItem {
    product: string;         // productId
    product_name: string;    // tên sản phẩm
    product_brand: string;   // thương hiệu
    product_img: string;     // ảnh sản phẩm
    unitPrice: number;       // giá 1 sản phẩm
    quantity: number;        // số lượng
    lineTotal: number;       // tổng tiền dòng
}

export interface ShippingAddress {
    fullName: string;
    line1: string;
    city: string;
    country: string;
    phone: string;
}

export interface PaymentMethod {
    type: string;       // cod, online, v.v
    provider?: string;  // shipper, paypal, v.v
}

export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'fulfilled' | 'cancelled';
export enum OrderStatusEnum {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PAID = 'paid',
    FULFILLED = 'fulfilled',
    CANCELLED = 'cancelled'
}
export function getOrderStatusLabel(status: any): string {
    switch (status) {
        case OrderStatusEnum.PENDING:
            return 'Chờ xử lý';
        case OrderStatusEnum.CONFIRMED:
            return 'Đã xác nhận';
        case OrderStatusEnum.PAID:
            return 'Đã thanh toán';
        case OrderStatusEnum.FULFILLED:
            return 'Hoàn tất';
        case OrderStatusEnum.CANCELLED:
            return 'Đã hủy';
        default:
            return 'Không xác định';
    }
}

export interface Order {
    _id: string;
    orderCode: string;
    user: string;           // userId
    contactEmail: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    discountCode?: string | null;
    discountRate: number;
    discountAmount: number;
    points_used: number;
    points_earned: number;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    currency: string;
    status: OrderStatus;
    placedAt: string;
    updatedAt: string;
}

export interface filterOrder {
    status?: OrderStatus | '';  // lọc theo trạng thái
    q?: string;                 // tìm kiếm theo orderCode hoặc email khách
    userId?: string;            // chỉ admin dùng
    guestId?: string;           // lọc khách vãng lai
    sort?: 'newest' | 'oldest';
    orderCode?: string;
}
