import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CartStore } from './cart.store';

describe('CartStore', () => {
  let store: CartStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), CartStore]
    });
    store = TestBed.inject(CartStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(store).toBeTruthy());
  it('should start with empty cart', () => expect(store.isEmpty()).toBeTrue());
  it('should have 0 item count initially', () => expect(store.itemCount()).toBe(0));
  it('should have 0 subtotal initially', () => expect(store.subtotal()).toBe(0));
});
