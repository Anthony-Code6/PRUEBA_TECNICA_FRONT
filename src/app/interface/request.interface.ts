// cliente

export interface CreateCustomerRequest {
  nombre: string;
  documento: string;
  email?: string;
}

export interface CustomerListRequest {
  nombre?: string;
  documento?: string;
}

// productos

export interface CreateProductRequest {
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
}

export interface ProductListRequest {
  nombre?: string;
  codigo?: string;
}

// order

export interface CreateOrderRequest {
  cliente_id: number;
  descuento_porcentaje?: number;
}

export interface AddOrderItemRequest {
  producto_id: number;
  cantidad: number;
}

export interface OrderListRequest {
  estado?: OrderStatus;
  cliente_id?: number;
}

export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETADO';
