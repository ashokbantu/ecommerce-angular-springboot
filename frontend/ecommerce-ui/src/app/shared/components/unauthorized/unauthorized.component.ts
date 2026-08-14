import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center py-5">
      <h1 class="display-1 text-danger">403</h1>
      <p class="lead">You don't have permission to access this page.</p>
      <a routerLink="/" class="btn btn-primary">Go Home</a>
    </div>
  `
})
export class UnauthorizedComponent {}
