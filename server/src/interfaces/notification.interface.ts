

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

export interface IResetPasswordSuccessEmail extends ISendResetPasswordEmail {

}