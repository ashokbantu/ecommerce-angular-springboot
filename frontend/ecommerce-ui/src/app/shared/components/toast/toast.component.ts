import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show align-items-center text-white border-0 {{ getClass(toast.type) }}" role="alert">
          <div class="d-flex">
            <div class="toast-body">{{ toast.message }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(toast.id)"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-success',
      error: 'bg-danger',
      info: 'bg-info',
      warning: 'bg-warning'
    };
    return map[type] || 'bg-secondary';
  }
}
