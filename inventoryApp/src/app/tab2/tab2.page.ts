import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonList,
  IonText,
  IonItemDivider,
  IonToggle,
  IonNote,
} from '@ionic/angular/standalone';

import { AlertController } from '@ionic/angular';

// import { InventoryItem } from '../models/inventory-item.model';

import { InventoryService } from '../services/inventory.service';

interface InventoryItem {
  itemName: string;
  category: string;
  quantity: number | null;
  price: number | null;
  supplierName: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | '';
  featured: boolean;
  specialNote?: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonList,
    IonText,
    IonItemDivider,
    IonToggle,
    IonNote,
  ],
})
export class Tab2Page {
  currentItem: InventoryItem = {
    itemName: '',
    category: '',
    quantity: null,
    price: null,
    supplierName: '',
    stockStatus: '',
    featured: false,
    specialNote: '',
  };

  // Placeholder featured items (UI only)
  featuredItems: InventoryItem[] = [
    {
      itemName: 'Sample Laptop',
      category: 'Electronics',
      quantity: 5,
      price: 1499.99,
      supplierName: 'Tech World',
      stockStatus: 'In Stock',
      featured: true,
      specialNote: 'Demo item',
    },
  ];

  constructor(private alertController: AlertController) {}

  async openHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: `
        • Fill in all required fields (marked with *).<br>
        • Quantity and Price must be numeric values.<br>
        • Turn on "Featured Item" to show it in the Featured Items list.<br>
      `,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onAddItem(form: NgForm) {
    if (form.invalid) {
      return;
    }

    console.log('Add Item:', {
      ...this.currentItem,
      featured: this.currentItem.featured ? 1 : 0,
    });

    if (this.currentItem.featured) {
      this.featuredItems.push({ ...this.currentItem });
    }

    form.resetForm({
      itemName: '',
      category: '',
      quantity: null,
      price: null,
      supplierName: '',
      stockStatus: '',
      featured: false,
      specialNote: '',
    });
  }
}
