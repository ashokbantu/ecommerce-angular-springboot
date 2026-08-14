import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent, SpinnerComponent],
  template: `
    <app-navbar />
    <main class="container-fluid py-4">
      <router-outlet />
    </main>
    <app-toast />
    <app-spinner />
  `
})
export class AppComponent {}
