import { Injectable } from '@angular/core';
import { apiUrl } from '../constants/api.constant';
import { HttpClient } from '@angular/common/http';
import { AuthDtos } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = apiUrl + 'auth';

  constructor(private http: HttpClient) { }

  RegisterAccount(params: AuthDtos) {
    console.log(params);
    return this.http.post<AuthDtos>(`${this.baseUrl}/register`, params);
  }

  Login(params: AuthDtos) {
    return this.http.post<AuthDtos>(`${this.baseUrl}/login`, params);
  }

  Logout() {
    return this.http.post<{}>(`${this.baseUrl}/logout`, {});
  }

  GetProfile() {
    return this.http.get<{}>(`${this.baseUrl}/profile`);
  }

  UpdateProfile(params: any) {
    return this.http.put<{}>(`${this.baseUrl}/profile`, params);
  }

  ChangePassword(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/change-password`, params);
  }

  ForgotPassword(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/forgot-password`, params);
  }

  ResetPassword(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/reset-password`, params);
  }

  VerifyEmail(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/verify-email`, params);
  }

  ResendVerificationEmail(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/resend-verification-email`, params);
  }

  SocialLogin(provider: string, params: any) {
    return this.http.post<{}>(`${this.baseUrl}/social-login/${provider}`, params);
  }

  SocialRegister(provider: string, params: any) {
    return this.http.post<{}>(`${this.baseUrl}/social-register/${provider}`, params);
  }

  LinkSocialAccount(provider: string, params: any) {
    return this.http.post<{}>(`${this.baseUrl}/link-social/${provider}`, params);
  }

  UnlinkSocialAccount(provider: string) {
    return this.http.post<{}>(`${this.baseUrl}/unlink-social/${provider}`, {});
  }

  GetLinkedSocialAccounts() {
    return this.http.get<{}>(`${this.baseUrl}/linked-social-accounts`);
  }

  RefreshToken(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/refresh-token`, params);
  }

  RevokeToken(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/revoke-token`, params);
  }

  GetAllUsers() {
    return this.http.get<{}>(`${this.baseUrl}/users`);
  }

  GetUserById(userId: string) {
    return this.http.get<{}>(`${this.baseUrl}/users/${userId}`);
  }

  UpdateUserById(userId: string, params: any) {
    return this.http.put<{}>(`${this.baseUrl}/users/${userId}`, params);
  }

  DeleteUserById(userId: string) {
    return this.http.delete<{}>(`${this.baseUrl}/users/${userId}`);
  }

  AssignRoleToUser(userId: string, role: string) {
    return this.http.post<{}>(`${this.baseUrl}/users/${userId}/roles`, { role });
  }

  RemoveRoleFromUser(userId: string, role: string) {
    return this.http.delete<{}>(`${this.baseUrl}/users/${userId}/roles/${role}`);
  }

  GetUserRoles(userId: string) {
    return this.http.get<{}>(`${this.baseUrl}/users/${userId}/roles`);
  }

  GetAllRoles() {
    return this.http.get<{}>(`${this.baseUrl}/roles`);
  }

  CreateRole(params: any) {
    return this.http.post<{}>(`${this.baseUrl}/roles`, params);
  }

  UpdateRole(roleId: string, params: any) {
    return this.http.put<{}>(`${this.baseUrl}/roles/${roleId}`, params);
  }

  DeleteRole(roleId: string) {
    return this.http.delete<{}>(`${this.baseUrl}/roles/${roleId}`);
  }

  GetRolePermissions(roleId: string) {
    return this.http.get<{}>(`${this.baseUrl}/roles/${roleId}/permissions`);
  }

  AssignPermissionToRole(roleId: string, permission: string) {
    return this.http.post<{}>(`${this.baseUrl}/roles/${roleId}/permissions`, { permission });
  }

  RemovePermissionFromRole(roleId: string, permission: string) {
    return this.http.delete<{}>(`${this.baseUrl}/roles/${roleId}/permissions/${permission}`);
  }

  GetAllPermissions() {
    return this.http.get<{}>(`${this.baseUrl}/permissions`);
  }
}
