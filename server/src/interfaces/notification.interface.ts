export interface ISendRegistrationEmail {
    fullname: string;
    email: string;
    tempPassword: string
}

export interface ISendResetPasswordEmail {
    fullname: string;
    email: string;
    requestId: string;
    resetLink?: string;
}

export interface IResetPasswordSuccessEmail extends ISendResetPasswordEmail {}

export interface ICreatedGuessAccountEmail extends ISendRegistrationEmail {}

export interface IOrderSuccessItem {
    name: string;
    qty: number;
    total: string;
    variant?: string | null;
    imageUrl?: string | null;
}

export interface IOrderSuccess {
    email: string;
    orderCode: string;
    fullName: string;
    orderDate: string;
    orderItems: IOrderSuccessItem[];
    shippingFee: string;
    tax: string;
    grandTotal: string;
    shipName: string;
    shipLine1: string;
    shipCity: string;
    shipCountry: string;
    shipPhone?: string | null;
    paymentMethod: string;
    paymentRef?: string | null;
}
