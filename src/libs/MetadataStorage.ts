import * as _ from 'lodash';

export class MetadataStorage {

  [k: string]: any;


  static $() {
    if (!this.$self) {
      this.$self = new MetadataStorage();
    }
    return this.$self;
  }


  static key(k: string): any[] {
    return this.$().key(k);
  }


  static clear() {
    this.$self = null;
  }


  key(k: string): any[] {
    if (!_.has(this, k)) {
      this[k] = [];
    }
    return this[k];
  }


  has(path: string) {
    return _.has(this, path);
  }


  get(key: string) {
    if (_.has(this, key)) {
      return this[key];
    }
    return undefined;
  }


  remove(key: string) {
    if (_.has(this, key)) {
      delete this[key];
    }
  }

}
