export const Permissions = {
    MANAGE_USERS: 'P000',
    MANAGE_PRODUCTS: 'P001',
    MANAGE_ORDERS: 'P002',
    VIEW_REPORTS: 'P003',

    MANAGE_CATEGORIES: 'P004',
    MANAGE_CUSTOMERS: 'P005',
    MANAGE_COUPONS: 'P006',
    MANAGE_PAYMENTS: 'P007',
    MANAGE_SHIPMENTS: 'P008',
    MANAGE_SETTINGS: 'P009',
    VIEW_AUDIT_LOGS: 'P010',
};

export const Roles = {
    ADMIN: {
        name: 'ADMIN',
        permissions: [
            Permissions.MANAGE_USERS,
            Permissions.MANAGE_PRODUCTS,
            Permissions.MANAGE_ORDERS,
            Permissions.MANAGE_CATEGORIES,
            Permissions.MANAGE_CUSTOMERS,
            Permissions.MANAGE_COUPONS,
            Permissions.MANAGE_PAYMENTS,
            Permissions.MANAGE_SHIPMENTS,
            Permissions.MANAGE_SETTINGS,
            Permissions.VIEW_REPORTS,
            Permissions.VIEW_AUDIT_LOGS,
        ],
    },
    MANAGER: {
        name: 'MANAGER',
        permissions: [
            Permissions.MANAGE_PRODUCTS,
            Permissions.MANAGE_ORDERS,
            Permissions.MANAGE_COUPONS,
            Permissions.VIEW_REPORTS,
        ],
    },
    USER: {
        name: 'USER',
        permissions: [
            Permissions.MANAGE_ORDERS,  // Chỉ quản lý đơn hàng của mình
            Permissions.VIEW_REPORTS,   // Xem báo cáo cá nhân
        ],
    },
};

export enum UserRoles {
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user'
}
