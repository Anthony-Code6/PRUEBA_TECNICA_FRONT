import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Server } from './service/server';
import {
  AddOrderItemRequest,
  CreateCustomerRequest,
  CreateOrderRequest,
  CreateProductRequest,
  OrderListRequest,
} from './interface/request.interface';
import {
  CustomerResponse,
  OrderListResponse,
  OrderResponse,
  ProductResponse,
} from './interface/response.interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private readonly server = inject(Server);

  // =========================================================
  // CLIENTES
  // =========================================================

  clientes: CustomerResponse[] = [];

  clienteNombre = '';
  clienteDocumento = '';
  clienteEmail = '';

  // =========================================================
  // PRODUCTOS
  // =========================================================

  productos: ProductResponse[] = [];

  productoCodigo = '';
  productoNombre = '';
  productoPrecio: number | null = null;
  productoStock: number | null = null;

  // =========================================================
  // PEDIDOS
  // =========================================================

  pedidos: OrderListResponse[] = [];

  pedidoClienteId: number | null = null;
  pedidoDescuento: number | null = 0;

  // =========================================================
  // DETALLE DEL PEDIDO
  // =========================================================

  pedidoSeleccionado: OrderResponse | null = null;

  detalleProductoId: number | null = null;
  detalleCantidad: number | null = 1;

  // =========================================================
  // ESTADOS
  // =========================================================

  cargandoClientes = false;
  cargandoProductos = false;
  cargandoPedidos = false;
  cargandoDetalle = false;

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.cargarClientes();

    this.cargarProductos();

    this.cargarPedidos();
  }

  // =========================================================
  // CLIENTES
  // =========================================================

  cargarClientes(): void {
    this.cargandoClientes = true;

    this.server.CustomefindAll().subscribe({
      next: (response) => {
        if (response.status) {
          this.clientes = response.data ?? [];
        } else {
          alert(response.message);
        }

        this.cargandoClientes = false;
      },

      error: (error) => {
        console.error('Error cargando clientes:', error);

        this.cargandoClientes = false;

        alert('No se pudieron cargar los clientes.');
      },
    });
  }

  crearCliente(): void {
    if (!this.clienteNombre.trim()) {
      alert('Ingrese el nombre del cliente.');
      return;
    }

    if (!this.clienteDocumento.trim()) {
      alert('Ingrese el documento.');
      return;
    }

    const request: CreateCustomerRequest = {
      nombre: this.clienteNombre.trim(),
      documento: this.clienteDocumento.trim(),
      email: this.clienteEmail.trim() || undefined,
    };

    this.server.Customecreate(request).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Cliente creado correctamente.');

        this.clienteNombre = '';
        this.clienteDocumento = '';
        this.clienteEmail = '';

        this.cargarClientes();
      },

      error: (error) => {
        console.error('Error creando cliente:', error);

        alert(error?.error?.message ?? 'No se pudo crear el cliente.');
      },
    });
  }

  // =========================================================
  // PRODUCTOS
  // =========================================================

  cargarProductos(): void {
    this.cargandoProductos = true;

    this.server.ProductfindAll().subscribe({
      next: (response) => {
        if (response.status) {
          this.productos = response.data ?? [];
        } else {
          alert(response.message);
        }

        this.cargandoProductos = false;
      },

      error: (error) => {
        console.error('Error cargando productos:', error);

        this.cargandoProductos = false;

        alert('No se pudieron cargar los productos.');
      },
    });
  }

  crearProducto(): void {
    if (!this.productoCodigo.trim()) {
      alert('Ingrese el código del producto.');
      return;
    }

    if (!this.productoNombre.trim()) {
      alert('Ingrese el nombre del producto.');
      return;
    }

    if (this.productoPrecio === null || this.productoPrecio < 0) {
      alert('Ingrese un precio válido.');
      return;
    }

    if (this.productoStock === null || this.productoStock < 0) {
      alert('Ingrese un stock válido.');
      return;
    }

    const request: CreateProductRequest = {
      codigo: this.productoCodigo.trim(),
      nombre: this.productoNombre.trim(),
      precio: this.productoPrecio,
      stock: this.productoStock,
    };

    this.server.Productcreate(request).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Producto creado correctamente.');

        this.productoCodigo = '';
        this.productoNombre = '';
        this.productoPrecio = null;
        this.productoStock = null;

        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error creando producto:', error);

        alert(error?.error?.message ?? 'No se pudo crear el producto.');
      },
    });
  }

  // =========================================================
  // PEDIDOS
  // =========================================================

  cargarPedidos(): void {
    this.cargandoPedidos = true;

    const request: OrderListRequest = {};

    this.server.OrderfindAll(request).subscribe({
      next: (response) => {
        if (response.status) {
          this.pedidos = response.data ?? [];
        } else {
          alert(response.message);
        }

        this.cargandoPedidos = false;
      },

      error: (error) => {
        console.error('Error cargando pedidos:', error);

        this.cargandoPedidos = false;

        alert('No se pudieron cargar los pedidos.');
      },
    });
  }

  crearPedido(): void {
    if (this.pedidoClienteId === null || this.pedidoClienteId <= 0) {
      alert('Seleccione un cliente.');
      return;
    }

    const request: CreateOrderRequest = {
      cliente_id: this.pedidoClienteId,
      descuento_porcentaje: this.pedidoDescuento ?? 0,
    };

    this.server.Ordercreate(request).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Pedido creado correctamente.');

        this.pedidoClienteId = null;
        this.pedidoDescuento = 0;

        this.cargarPedidos();

        if (response.data) {
          this.pedidoSeleccionado = response.data;
        }
      },

      error: (error) => {
        console.error('Error creando pedido:', error);

        alert(error?.error?.message ?? 'No se pudo crear el pedido.');
      },
    });
  }

  // =========================================================
  // VER PEDIDO
  // =========================================================

  verPedido(id: number): void {
    this.cargandoDetalle = true;

    this.server.OrderfindById(id).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.pedidoSeleccionado = response.data;

          // Reiniciamos formulario de detalle
          this.detalleProductoId = null;
          this.detalleCantidad = 1;
        } else {
          alert(response.message);
        }

        this.cargandoDetalle = false;
      },

      error: (error) => {
        console.error('Error obteniendo pedido:', error);

        this.cargandoDetalle = false;

        alert('No se pudo obtener el pedido.');
      },
    });
  }

  // =========================================================
  // AGREGAR PRODUCTO AL PEDIDO
  // =========================================================

  agregarProductoPedido(): void {
    if (!this.pedidoSeleccionado) {
      alert('Seleccione un pedido.');
      return;
    }

    if (this.pedidoSeleccionado.estado !== 'PENDIENTE') {
      alert('Solo puede modificar pedidos pendientes.');
      return;
    }

    if (this.detalleProductoId === null || this.detalleProductoId <= 0) {
      alert('Seleccione un producto.');
      return;
    }

    if (this.detalleCantidad === null || this.detalleCantidad <= 0) {
      alert('Ingrese una cantidad válida.');
      return;
    }

    const request: AddOrderItemRequest = {
      producto_id: this.detalleProductoId,
      cantidad: this.detalleCantidad,
    };

    this.server.OrderaddItem(this.pedidoSeleccionado.id, request).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        if (response.data) {
          this.pedidoSeleccionado = response.data;
        }

        this.detalleProductoId = null;
        this.detalleCantidad = 1;

        this.cargarPedidos();
      },

      error: (error) => {
        console.error('Error agregando producto al pedido:', error);

        alert(error?.error?.message ?? 'No se pudo agregar el producto.');
      },
    });
  }

  // =========================================================
  // ELIMINAR ITEM
  // =========================================================

  eliminarItem(itemId: number): void {
    if (!this.pedidoSeleccionado) {
      return;
    }

    if (this.pedidoSeleccionado.estado !== 'PENDIENTE') {
      alert('Solo puede modificar pedidos pendientes.');
      return;
    }

    const confirmar = confirm('¿Desea eliminar este producto del pedido?');

    if (!confirmar) {
      return;
    }

    this.server.OrderdeleteItem(this.pedidoSeleccionado.id, itemId).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        if (response.data) {
          this.pedidoSeleccionado = response.data;
        }

        this.cargarPedidos();
      },

      error: (error) => {
        console.error('Error eliminando item:', error);

        alert(error?.error?.message ?? 'No se pudo eliminar el producto.');
      },
    });
  }

  // =========================================================
  // CONFIRMAR PEDIDO
  // =========================================================

  confirmarPedido(id?: number): void {
    const pedidoId = id ?? this.pedidoSeleccionado?.id;

    if (!pedidoId) {
      alert('Seleccione un pedido.');
      return;
    }

    const confirmar = confirm('¿Desea confirmar este pedido? Se descontará el stock.');

    if (!confirmar) {
      return;
    }

    this.server.Orderconfirm(pedidoId).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Pedido confirmado correctamente.');

        if (this.pedidoSeleccionado?.id === pedidoId && response.data) {
          this.pedidoSeleccionado = response.data;
        }

        this.cargarPedidos();
        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error confirmando pedido:', error);

        alert(error?.error?.message ?? 'No se pudo confirmar el pedido.');
      },
    });
  }

  // =========================================================
  // COMPLETAR PEDIDO
  // =========================================================

  completarPedido(id?: number): void {
    const pedidoId = id ?? this.pedidoSeleccionado?.id;

    if (!pedidoId) {
      alert('Seleccione un pedido.');
      return;
    }

    this.server.Ordercomplete(pedidoId).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Pedido completado correctamente.');

        if (this.pedidoSeleccionado?.id === pedidoId && response.data) {
          this.pedidoSeleccionado = response.data;
        }

        this.cargarPedidos();
      },

      error: (error) => {
        console.error('Error completando pedido:', error);

        alert(error?.error?.message ?? 'No se pudo completar el pedido.');
      },
    });
  }

  // =========================================================
  // CANCELAR PEDIDO
  // =========================================================

  cancelarPedido(id?: number): void {
    const pedidoId = id ?? this.pedidoSeleccionado?.id;

    if (!pedidoId) {
      alert('Seleccione un pedido.');
      return;
    }

    const confirmar = confirm('¿Desea cancelar este pedido?');

    if (!confirmar) {
      return;
    }

    this.server.Ordercancel(pedidoId).subscribe({
      next: (response) => {
        if (!response.status) {
          alert(response.message);
          return;
        }

        alert('Pedido cancelado correctamente.');

        if (this.pedidoSeleccionado?.id === pedidoId && response.data) {
          this.pedidoSeleccionado = response.data;
        }

        this.cargarPedidos();
        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error cancelando pedido:', error);

        alert(error?.error?.message ?? 'No se pudo cancelar el pedido.');
      },
    });
  }
}
