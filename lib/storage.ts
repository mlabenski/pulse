interface StorageMethods {
  async?: boolean;
  get?: any;
  set?: any;
  remove?: any;
}

export default class Storage {
  private isPromise: boolean = false;
  private storageReady: boolean = false;
  private storageType: 'localStorage' | 'custom' = 'localStorage';
  constructor(private storageMethods: StorageMethods = {}) {
    if (storageMethods.async) this.isPromise = true;

    // assume if user provided get, set or remove methods that the storage type is custom
    if (storageMethods.get || storageMethods.set || storageMethods.remove) {
      this.storageType = 'custom';
    }

    if (this.localStorageAvailable() && this.storageType === 'localStorage') {
      this.storageReady = true;
      storageMethods.get = localStorage.getItem.bind(localStorage);
      storageMethods.set = localStorage.setItem.bind(localStorage);
      storageMethods.remove = localStorage.removeItem.bind(localStorage);
    } else {
      this.storageType = 'custom';

      if (
        this.check(storageMethods.get) &&
        this.check(storageMethods.set) &&
        this.check(storageMethods.remove)
      ) {
        this.storageReady = true;
      } else {
        this.storageReady = false;
        // bad
      }
    }
  }

  public get(collection, key) {
    if (!this.storageReady) return;

    if (this.isPromise) {
      return new Promise((resolve, reject) => {
        this.storageMethods
          .get(this.getKey(collection, key))
          .then(res => {
            // if result is not JSON for some reason, return it.
            if (typeof res !== 'string') return resolve(res);

            resolve(JSON.parse(res));
          })
          .catch(reject);
      });
    } else {
      return JSON.parse(this.storageMethods.get(this.getKey(collection, key)));
    }
  }

  public set(collection, key, value) {
    if (!this.storageReady) return;
    this.storageMethods.set(
      this.getKey(collection, key),
      JSON.stringify(value)
    );
  }

  public remove(collection, key) {
    if (!this.storageReady) return;
    this.storageMethods.remove(this.getKey(collection, key));
  }

  private getKey(collection, key) {
    return `_${collection}_${key}`;
  }

  private check(func) {
    return typeof func === 'function';
  }

  private localStorageAvailable() {
    try {
      localStorage.setItem('_', '_');
      localStorage.removeItem('_');
      return true;
    } catch (e) {
      return false;
    }
  }
}
