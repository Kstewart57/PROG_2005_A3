// Interface defining the structure of inventory items from API
export interface InventoryItem {
  item_id: number;
  item_name: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;
  price: number;
  supplier_name: string;
  stock_status: 'In stock' | 'Low stock' | 'Out of stock';
  featured_item: number;
  special_note?: string | null;
}
