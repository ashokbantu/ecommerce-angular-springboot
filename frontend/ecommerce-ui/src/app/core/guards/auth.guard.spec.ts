import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    router = TestBed.inject(Router);
  });

  it('should redirect to login when not authenticated', () => {
    const navigateSpy = spyOn(router, 'navigate');
    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as never, {} as never);
      expect(result).toBeFalse();
      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });
  });
});
