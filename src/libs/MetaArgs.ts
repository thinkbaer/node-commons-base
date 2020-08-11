import {MetadataStorage} from './MetadataStorage';

/**
 * Replaced in future by MetadataStorage
 */
export class MetaArgs {


  static $(): MetadataStorage {
    return MetadataStorage.$();
  }


  static key(k: string): any[] {
    return this.$().key(k);
  }


  static clear() {
    return MetadataStorage.clear();
  }


}
