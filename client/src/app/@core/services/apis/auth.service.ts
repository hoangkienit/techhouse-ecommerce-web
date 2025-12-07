import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthDtos } from '../../models/auth.model';
import { apiUrl, apiUrl_test } from '../../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl = apiUrl + 'auth';
  private baseUrl = apiUrl_test + 'auth';
  private credentials = { withCredentials: true };

  constructor(private http: HttpClient) { }

  getUserFromCookie(): any | null {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('currentUser='));
    if (!cookie) return null;

    try {
      return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch {
      return null;
    }
  }

  RegisterAccount(params: AuthDtos) {
    return this.http.post<AuthDtos>(`${this.baseUrl}/register`, params, this.credentials);
  }

  Login(params: AuthDtos) {
    return this.http.post<any>(`${this.baseUrl}/login`, params, this.credentials);
  }


  Logout() {
    return this.http.get<{}>(`${this.baseUrl}/logout`, this.credentials);
  }

  // AssignRoleToUser(userId: string, role: string) {
  //   return this.http.post<{}>(`${this.baseUrl}/users/${userId}/roles`, { role }, this.credentials);
  // }

  // RemoveRoleFromUser(userId: string, role: string) {
  //   return this.http.delete<{}>(`${this.baseUrl}/users/${userId}/roles/${role}`, this.credentials);
  // }

  // GetUserRoles(userId: string) {
  //   return this.http.get<{}>(`${this.baseUrl}/users/${userId}/roles`, this.credentials);
  // }

  // GetAllRoles() {
  //   return this.http.get<{}>(`${this.baseUrl}/roles`, this.credentials);
  // }

  // CreateRole(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/roles`, params, this.credentials);
  // }

  // UpdateRole(roleId: string, params: any) {
  //   return this.http.put<{}>(`${this.baseUrl}/roles/${roleId}`, params, this.credentials);
  // }

  // DeleteRole(roleId: string) {
  //   return this.http.delete<{}>(`${this.baseUrl}/roles/${roleId}`, this.credentials);
  // }

  // GetRolePermissions(roleId: string) {
  //   return this.http.get<{}>(`${this.baseUrl}/roles/${roleId}/permissions`, this.credentials);
  // }

  // AssignPermissionToRole(roleId: string, permission: string) {
  //   return this.http.post<{}>(`${this.baseUrl}/roles/${roleId}/permissions`, { permission }, this.credentials);
  // }

  // RemovePermissionFromRole(roleId: string, permission: string) {
  //   return this.http.delete<{}>(`${this.baseUrl}/roles/${roleId}/permissions/${permission}`, this.credentials);
  // }

  // GetAllPermissions() {
  //   return this.http.get<{}>(`${this.baseUrl}/permissions`, this.credentials);
  // }

  // LoginGoogle() {
  //   return this.http.get<{}>(`${this.baseUrl}/google`, this.credentials);
  // }


  // GetProfile() {
  //   return this.http.get<{}>(`${this.baseUrl}/profile`, this.credentials);
  // }

  // UpdateProfile(params: any) {
  //   return this.http.put<{}>(`${this.baseUrl}/profile`, params, this.credentials);
  // }

  // ChangePassword(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/change-password`, params, this.credentials);
  // }

  // ForgotPassword(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/forgot-password`, params, this.credentials);
  // }

  // ResetPassword(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/reset-password`, params, this.credentials);
  // }

  // VerifyEmail(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/verify-email`, params, this.credentials);
  // }

  // ResendVerificationEmail(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/resend-verification-email`, params, this.credentials);
  // }

  // SocialLogin(provider: string, params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/social-login/${provider}`, params, this.credentials);
  // }

  // SocialRegister(provider: string, params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/social-register/${provider}`, params, this.credentials);
  // }

  // LinkSocialAccount(provider: string, params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/link-social/${provider}`, params, this.credentials);
  // }

  // UnlinkSocialAccount(provider: string) {
  //   return this.http.post<{}>(`${this.baseUrl}/unlink-social/${provider}`, {}, this.credentials);
  // }

  // GetLinkedSocialAccounts() {
  //   return this.http.get<{}>(`${this.baseUrl}/linked-social-accounts`, this.credentials);
  // }

  // RefreshToken(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/refresh-token`, params, this.credentials);
  // }

  // RevokeToken(params: any) {
  //   return this.http.post<{}>(`${this.baseUrl}/revoke-token`, params, this.credentials);
  // }
}
