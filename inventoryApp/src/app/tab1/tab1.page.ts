import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonButton, IonButtons, IonModal } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory-item.model';
import { AlertController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonSearchbar, IonButton, IonButtons, CommonModule, FormsModule],
})
export class Tab1Page implements OnInit {
  inventoryItems: InventoryItem[] = []; // Stores all items from API
  searchResults: InventoryItem[] = []; // Stores items currently displayed in table
  searchTerm: string = ''; // Bound to search bar input
  loading = true; // Controls loading message display
  showHelp = false; // Controls help visibility

  constructor(private inventoryService: InventoryService,
    private alertController: AlertController ) {}

  // Fetch all inventory items on page load
  ngOnInit() {
    this.inventoryService.getInventoryItems().subscribe({
      next: (data) => {
        this.inventoryItems = data;
        this.searchResults = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      }
    });
  }

  // Search for items by name using API endpoint
  searchItems() {
    if (this.searchTerm.trim() === '') {
      this.searchResults = this.inventoryItems;
    } else {
      this.inventoryService.getInventoryItemByName(this.searchTerm).subscribe({
        next: (data) => this.searchResults = data,
        error: () => this.searchResults = []
      });
    }
  }

  // Reset search and show all items
  refreshItems() {
    this.searchTerm = '';
    this.searchResults = this.inventoryItems;
  }

  // Toggle help 
  toggleHelp() {
    this.showHelp = !this.showHelp;
  }


// show help information
async showHelpAlert(): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Update / Delete help',
    message:
      '• Enter an item name and click Search to find specific items.\n' +
      '• Click Refresh to reset the search and display all items.\n' +
      '• View all inventory data including ID, name, category, quantity, price, supplier, stock status, featured status, and notes.\n',
    buttons: ['OK'],
    cssClass: 'help-alert'
  });

  await alert.present();
}

}
