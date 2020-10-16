import dayjs from 'dayjs';
import { Mail } from './mail';

interface IStorage {
  set(mail: string): boolean;
  store(mail: Mail): boolean;
  get(mail: string): Array<Mail> | false;
}

export class Storage implements IStorage {
  private static instance: Storage;
  private engine!: IStorage;

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private constructor() {
    this.engine = new MemoryStorage();
  }

  useEngine(cls: any) {
    this.engine = new cls();
  }

  set(mail: string): boolean {
    return this.engine.set(mail);
  }

  store(mail: Mail): boolean {
    return this.engine.store(mail);
  }

  get(email: string): false | Mail[] {
    return this.engine.get(email);
  }
}

export class StorageItem {
  messages: Mail[];
  created: Date = new Date();
  ttl: number; // seconds

  constructor() {
    this.ttl = 3600;
    this.messages = [];
  }

  isDead(): boolean {
    return dayjs() > dayjs(this.created).add(this.ttl, 'second');
  }
}

export class MemoryStorage implements IStorage {
  db: Map<string, StorageItem> = new Map();

  set(mail: string) {
    this.db.set(mail, new StorageItem());
    return true;
  }

  store(mail: Mail): boolean {
    if (this.db.has(mail.to)) {
      let inbox = this.db.get(mail.to);

      // delete if ttl is over
      if (inbox?.isDead()) {
        this.db.delete(mail.to);
        return false;
      }

      // save if ttl is still valid
      inbox?.messages.push(mail);
    } else {
      this.set(mail.to);
    }

    return true;
  }

  get(email: string): Mail[] | false {
    let inbox = this.db.get(email);

    // if is dead inbox
    if (inbox?.isDead()) {
      this.db.delete(email);
      return false;
    }

    return inbox?.messages || false;
  }
}
