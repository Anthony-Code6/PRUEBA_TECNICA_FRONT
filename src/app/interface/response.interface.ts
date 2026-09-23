// cliente

import { OrderStatus } from './request.interface';

export interface CustomerResponse {
  id: number;
  nombre: string;
  documento: string;
  email: string | null;
  activo: boolean;
}

// producto

export interface ProductResponse {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
}

// order

export interface OrderItemResponse {
  id: number;
  producto_id: number;
  codigo: string;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  numero: string;
  cliente: string;
  estado: OrderStatus;
  subtotal: number;
  descuento: number;
  total: number;
  descuento_porcentaje?: number;
  fecha_creacion: string;
  items: OrderItemResponse[];
}

export interface OrderListResponse {
  id: number;
  numero: string;
  cliente: string;
  estado: OrderStatus;
  subtotal: number;
  descuento: number;
  total: number;
  fecha_creacion: string;
}
