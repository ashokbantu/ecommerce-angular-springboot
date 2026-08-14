# ecommerce-ui - Angular 17+ Frontend

## Folder Structure
- `core/` - Singleton services, guards, interceptors, models, signal-based stores
  - `services/` - AuthService, ProductService, OrderService, ToastService, LoadingService  
  - `store/` - CartStore (signal-based state management)
  - `guards/` - authGuard (CanActivateFn), roleGuard (factory)
  - `interceptors/` - jwtInterceptor, errorInterceptor, loadingInterceptor
  - `models/` - TypeScript interfaces for domain objects
- `shared/` - Reusable standalone components, pipes, directives
  - `components/` - Toast, Spinner, NotFound, Unauthorized
  - `pipes/` - CurrencyFormatPipe, OrderStatusBadgePipe
  - `directives/` - HasRoleDirective
- `features/` - Lazy-loaded feature modules (standalone)
  - `auth/` - Login, Register pages
  - `catalog/` - Product list + detail
  - `cart/` - Cart page
  - `checkout/` - Multi-step checkout
  - `orders/` - Order history + detail
  - `admin/` - Admin dashboard (ROLE_ADMIN guarded)
  - `seller/` - Seller dashboard (ROLE_SELLER guarded)
- `layout/` - NavbarComponent (role-based dynamic menu)

## Key Angular Concepts Used
- Standalone components (no NgModules)
- Signals: signal(), computed(), effect()
- New control flow: @if, @for, @switch, @defer
- Functional guards: CanActivateFn
- Functional interceptors: HttpInterceptorFn
- Lazy routes with loadComponent/loadChildren
- Reactive Forms with custom validators
- inject() for DI in services and interceptors
