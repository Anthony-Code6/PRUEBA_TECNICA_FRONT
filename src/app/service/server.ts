import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AddOrderItemRequest,
  CreateCustomerRequest,
  CreateOrderRequest,
  CreateProductRequest,
  CustomerListRequest,
  OrderListRequest,
  ProductListRequest,
} from '../interface/request.interface';
import { Observable } from 'rxjs';
import {
  CustomerResponse,
  OrderListResponse,
  OrderResponse,
  ProductResponse,
} from '../interface/response.interface';
import { ResponseServer } from '../interface/response_server';

@Injectable({
  providedIn: 'root',
})
export class Server {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/';

  private readonly customerUrl = this.apiUrl + 'customers';
  private readonly productUrl = this.apiUrl + 'products';
  private readonly orderUrl = this.apiUrl + 'orders';

  Customecreate(request: CreateCustomerRequest): Observable<ResponseServer<CustomerResponse>> {
    return this.http.post<ResponseServer<CustomerResponse>>(this.customerUrl, request);
  }

  CustomefindAll(request?: CustomerListRequest): Observable<ResponseServer<CustomerResponse[]>> {
    let params = new HttpParams();

    if (request?.nombre) {
      params = params.set('nombre', request.nombre);
    }

    if (request?.documento) {
      params = params.set('documento', request.documento);
    }

    return this.http.get<ResponseServer<CustomerResponse[]>>(this.customerUrl, { params });
  }

  // producto
  Productcreate(request: CreateProductRequest): Observable<ResponseServer<ProductResponse>> {
    return this.http.post<ResponseServer<ProductResponse>>(this.productUrl, request);
  }

  ProductfindAll(request?: ProductListRequest): Observable<ResponseServer<ProductResponse[]>> {
    let params = new HttpParams();

    if (request?.nombre) {
      params = params.set('nombre', request.nombre);
    }

    if (request?.codigo) {
      params = params.set('codigo', request.codigo);
    }

    return this.http.get<ResponseServer<ProductResponse[]>>(this.productUrl, { params });
  }

  // order

  Ordercreate(request: CreateOrderRequest): Observable<ResponseServer<OrderResponse>> {
    return this.http.post<ResponseServer<OrderResponse>>(this.orderUrl, request);
  }

  OrderfindAll(request?: OrderListRequest): Observable<ResponseServer<OrderListResponse[]>> {
    let params = new HttpParams();

    if (request?.estado) {
      params = params.set('estado', request.estado);
    }

    if (request?.cliente_id) {
      params = params.set('cliente_id', request.cliente_id.toString());
    }

    return this.http.get<ResponseServer<OrderListResponse[]>>(this.orderUrl, { params });
  }

  OrderfindById(id: number): Observable<ResponseServer<OrderResponse>> {
    return this.http.get<ResponseServer<OrderResponse>>(`${this.orderUrl}/${id}`);
  }

  OrderaddItem(
    pedidoId: number,
    request: AddOrderItemRequest,
  ): Observable<ResponseServer<OrderResponse>> {
    return this.http.post<ResponseServer<OrderResponse>>(
      `${this.orderUrl}/${pedidoId}/items`,
      request,
    );
  }

  OrderdeleteItem(pedidoId: number, itemId: number): Observable<ResponseServer<OrderResponse>> {
    return this.http.delete<ResponseServer<OrderResponse>>(
      `${this.orderUrl}/${pedidoId}/items/${itemId}`,
    );
  }

  Orderconfirm(id: number): Observable<ResponseServer<OrderResponse>> {
    return this.http.post<ResponseServer<OrderResponse>>(`${this.orderUrl}/${id}/confirm`, {});
  }

  Ordercomplete(id: number): Observable<ResponseServer<OrderResponse>> {
    return this.http.post<ResponseServer<OrderResponse>>(`${this.orderUrl}/${id}/complete`, {});
  }

  Ordercancel(id: number): Observable<ResponseServer<OrderResponse>> {
    return this.http.post<ResponseServer<OrderResponse>>(`${this.orderUrl}/${id}/cancel`, {});
  }
}
