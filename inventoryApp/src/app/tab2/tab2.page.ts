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

import { InventoryItem } from '../models/inventory-item.model';

import { InventoryService } from '../services/inventory.service';

interface InventoryFormItem {
  itemName: string;
  category: string;
  quantity: number | null;
  price: number | null;
  supplierName: string;
  stockStatus: 'In stock' | 'Low stock' | 'Out of stock' | '';
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

export class Tab2Page implements OnInit {
  currentItem: InventoryFormItem = {
    itemName: '',
    category: '',
    quantity: null,
    price: null,
    supplierName: '',
    stockStatus: '',
    featured: false,
    specialNote: '',
  };

  // Featured items loaded from backend
  featuredItems: InventoryItem[] = [];

  constructor(
    private alertController: AlertController, 
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadFeaturedItems();
  }

  async openHelp() {
    const alert = await this.alertController.create({
      header: 'Help',
      message: 
        '• Fill in all required fields (marked with *).' + '\n' +
        '• Quantity and Price must be numeric values.' + '\n' +
        '• Turn on "Featured Item" to show it in the Featured Items list.',
      buttons: ['OK'],
      cssClass: 'help-alert',
    });

    await alert.present();
  }

  onAddItem(form: NgForm) {
    if (form.invalid) return;

    const payload = {
      item_name: this.currentItem.itemName,
      category: this.currentItem.category,
      quantity: Number(this.currentItem.quantity),
      price: Number(this.currentItem.price),
      supplier_name: this.currentItem.supplierName,
      stock_status: this.currentItem.stockStatus,
      featured_item: this.currentItem.featured ? 1 : 0,
      special_note: this.currentItem.specialNote || null,
    };

    this.inventoryService.createItem(payload).subscribe({
      next: async () => {
        await this.showAlert('Success', 'Item added successfully.');

        // reset form
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

        this.loadFeaturedItems();   // Refresh featured section
      },

      error: async (err) => {
        console.error('API error:', err);
        await this.showAlert(
          'Error',
          'There was a problem adding the item. Please try again.'
        );
      },
    });
}

private loadFeaturedItems() {
    this.inventoryService.getInventoryItems().subscribe({
      next: (items) => {
        this.featuredItems = (items || []).filter(
          (i) => i.featured_item === 1
        );
      },
      error: (err) => {
        console.error('Error loading featured items:', err);
      },
    });
  }

  // Helper for alerts
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}