import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if (loadingService.loading()) {
      <div class="spinner-overlay d-flex justify-content-center align-items-center">
        <div class="spinner-border text-primary" style="width:3rem;height:3rem" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }
  `
})
export class SpinnerComponent {
  loadingService = inject(LoadingService);
}
