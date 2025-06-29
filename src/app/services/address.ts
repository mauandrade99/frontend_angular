import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }


  getEnderecoByCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getAddressesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/addresses`);
  }

  createAddress(userId: number, addressData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/addresses`, addressData);
  }
  
  updateAddress(userId: number, addressId: number, addressData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/addresses/${addressId}`, addressData);
  }

  deleteAddress(userId: number, addressId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/addresses/${addressId}`);
  }
}