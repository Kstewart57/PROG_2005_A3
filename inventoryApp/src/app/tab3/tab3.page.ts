/*
  Assignment 3: Inventory Update/Delete Tab
  Author: Stephen Travers 23885594
  Description: Tab for finding, updating and deleting inventory items using the API.
*/

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InventoryService, Item } from '../services/inventory.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {
  // name typed into the search box
  searchName = '';

  // item list returned from the API
  currentItem: Item[] = [];

  // name typed into the delete box
  deleteName = '';

  // delete feedback text
  deleteMessage = '';
  deleteIsError = false;

  // search feedback text
  formMessage = '';
  formIsError = false;

  // update feedback text
  updateMessage = '';
  updateIsError = false;

  // inject the inventory API service and alert controller
  constructor(
    private inventoryService: InventoryService,
    private alertController: AlertController
  ) {}

  // show help information in a popup
async showHelpAlert(): Promise<void> {
  const alert = await this.alertController.create({
    header: 'Update / Delete help',
    message:
      '• Use "Find item" to search by name.\n' +
      '• Use "Edit item" to change details and tap "Save changes".\n' +
      '• Use "Delete item" to remove items.\n' +
      '• The item "Laptop" cannot be deleted (the server will return an error).',
    buttons: ['OK'],
    cssClass: 'help-alert'
  });

  await alert.present();
}

  // run when the user clicks Search
  onSearch() {
    const name = this.searchName.trim();

    // validation check
    if (!name) {
      this.formMessage = 'Enter name to search';
      this.formIsError = true;
      return;
    }

    // ask the API for items that match the name
    this.inventoryService.getInventoryItemByName(name).subscribe({
      next: (items: any[]) => {
        this.currentItem = items as Item[];

        // message based on result
        if (this.currentItem.length) {
          this.formMessage = 'Item found';
          this.formIsError = false;
        } else {
          this.formMessage = 'Item not found';
          this.formIsError = true;
        }
      },
      // if the call fails, clear the item and show an error
      error: () => {
        this.currentItem = [];
        this.formMessage = 'Item not found';
        this.formIsError = true;
      }
    });
  }

  // run when the user clicks Save changes if an item is selected
  onUpdate() {
    // make sure an item is loaded
    if (!this.currentItem.length || !this.currentItem[0]) {
      this.updateMessage = 'Search for an item before saving changes';
      this.updateIsError = true;
      return;
    }

    const itemToSave = this.currentItem[0];

    // numeric validation
    if (itemToSave.quantity < 0 || itemToSave.price < 0) {
      this.updateMessage = 'Quantity and price must be zero or higher';
      this.updateIsError = true;
      return;
    }

    this.inventoryService.updateItem(itemToSave.item_name, itemToSave).subscribe({
      next: () => {
        // success message
        this.updateMessage = 'Item updated';
        this.updateIsError = false;
      },
      // error message if the update fails
      error: () => {
        this.updateMessage = 'Update failed';
        this.updateIsError = true;
      }
    });
  }

  // run when the user clicks Delete
  onDelete() {
    const name = this.deleteName.trim();

    // validation check
    if (!name) {
      this.deleteMessage = 'Enter name to delete';
      this.deleteIsError = true;
      return;
    }

    // confirmation before deleting
    if (!window.confirm(`Delete "${name}"?`)) {
      this.deleteMessage = 'Cancelled';
      this.deleteIsError = true;
      return;
    }

    // call the API to delete the item
    this.inventoryService.deleteItem(name).subscribe({
      next: (res) => {
        this.deleteMessage = (res as any)?.message || 'Deleted';
        this.deleteIsError = false;

        // after deletion clear the item if it was on screen
        if (this.currentItem[0]?.item_name === name) {
          this.currentItem = [];
        }
      },
      // handle delete errors (e.g. Laptop rule or name not found)
      error: () => {
        this.deleteMessage = 'Delete failed (Laptop cannot be deleted or name not found)';
        this.deleteIsError = true;
      }
    });
  }
}

