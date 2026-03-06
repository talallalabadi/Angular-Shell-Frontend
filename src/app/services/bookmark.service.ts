import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ItemType = 'newspaper' | 'magazine' | 'radio' | 'tv' | 'other';

export interface Bookmark {
  item_id: string;
  item_type: ItemType;
  title: string;
  url: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private _list = new BehaviorSubject<Bookmark[]>([]);
  list$ = this._list.asObservable();

  constructor() {
    this.loadForCurrentUser();
  }

  private getUserId(): string {
    return localStorage.getItem('auth.userId') || 'guest';
  }

  private key(uid: string) {
    return `bookmarks:${uid}`;
  }

  loadForCurrentUser() {
    const raw = localStorage.getItem(this.key(this.getUserId()));
    this._list.next(raw ? JSON.parse(raw) : []);
  }

  private save(list: Bookmark[]) {
    localStorage.setItem(this.key(this.getUserId()), JSON.stringify(list));
    this._list.next(list);
  }

  getList(): Bookmark[] {
    return this._list.value;
  }

  isBookmarked(item_id: string, item_type: ItemType) {
    return this.getList().some(b => b.item_id === item_id && b.item_type === item_type);
  }

  add(b: Bookmark) {
    if (this.isBookmarked(b.item_id, b.item_type)) return;
    const list = [...this.getList(), { ...b, created_at: new Date().toISOString() }];
    this.save(list);
  }

  remove(item_id: string, item_type: ItemType) {
    const list = this.getList().filter(b => !(b.item_id === item_id && b.item_type === item_type));
    this.save(list);
  }

  toggle(b: Bookmark) {
    this.isBookmarked(b.item_id, b.item_type)
      ? this.remove(b.item_id, b.item_type)
      : this.add(b);
  }
}
