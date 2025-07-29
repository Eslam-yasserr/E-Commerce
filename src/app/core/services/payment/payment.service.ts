import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private httpClient: HttpClient) {}

  myToken = localStorage.getItem('myToken')!;

  checkOutSession(id: string, shippingData: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${id}?url=${window.location.origin}`,
      {
        shippingAddress: shippingData,
      },
      {
        headers: {
          token: this.myToken,
        },
      }
    );
  }

  getUserOrders(id: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${id}`,
      
    );
  }

}
