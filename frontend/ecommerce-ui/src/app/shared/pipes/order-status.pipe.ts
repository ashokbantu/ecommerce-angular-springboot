import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../core/models/order.model';

@Pipe({ name: 'orderStatusBadge', standalone: true })
export class OrderStatusBadgePipe implements PipeTransform {
  transform(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      CREATED: 'bg-secondary',
      PAID: 'bg-info',
      SHIPPED: 'bg-primary',
      DELIVERED: 'bg-success',
      CANCELLED: 'bg-danger'
    };
    return map[status] ?? 'bg-secondary';
  }
}
