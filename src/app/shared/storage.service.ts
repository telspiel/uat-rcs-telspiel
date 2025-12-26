import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

const USER_DATA = "USER_DATA";
const TOKEN = "TOKEN";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) { }

  // Get/Set User data

  getUser() {
    return this.get(USER_DATA);
  }

  setUser(data: string) {
    this.set(USER_DATA, data);
  }

  // Get/Set Token

  getToken() {
    return this.get(TOKEN);
  }

  setToken(data: string) {
    this.set(TOKEN, data);
  }

  // Core Service
  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

}
