import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory-item.model';

export interface Item {
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: string;
  popular_item: string;
  comment?: string;
  featured_item?: number;
  special_note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private http: HttpClient) { }

  // Fetch all inventory items from API
  getInventoryItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  // Search for inventory items by name
  getInventoryItemByName(name: string): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(
      `${this.apiUrl}/${encodeURIComponent(name)}`
    );
  }

  // Create new item in Inventory
  createItem(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }
  
  // Updating an existing Item
  updateItem(name: string, item: Item): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${encodeURIComponent(name)}`,
      item
    );
  }
  
  // Delete an existing item
  deleteItem(name: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${encodeURIComponent(name)}`
    );
  }
}
