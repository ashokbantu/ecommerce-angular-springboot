import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();
  private activeRequests = 0;

  show() {
    this.activeRequests++;
    this._loading.set(true);
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this._loading.set(false);
    }
  }
}
