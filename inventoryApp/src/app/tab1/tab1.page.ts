import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory-item.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, CommonModule],
})
export class Tab1Page implements OnInit {
  inventoryItems: InventoryItem[] = [];
  loading = true;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getInventoryItems().subscribe({
      next: (data) => {
        this.inventoryItems = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching inventory:', error);
        this.loading = false;
      }
    });
  }
}
