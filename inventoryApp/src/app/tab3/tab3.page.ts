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

    // name must not be empty
    if (!name) {
      this.formMessage = 'Enter name to search';
      this.formIsError = true;
      return;
    }

    // name must not only be numbers
    if (/^\d+$/.test(name)) {
      this.formMessage = 'Name must include text, not just numbers';
      this.formIsError = true;
      return;
    }

    // ask the API for items that match the name
    this.inventoryService.getInventoryItemByName(name).subscribe({
      next: (items: any[]) => {
        this.currentItem = items as Item[];

        // set featured to 0 or 1 for the Yes/No select
        if (this.currentItem.length && this.currentItem[0]) {
          const raw = (this.currentItem[0] as any).featured_item;
          const num = Number(raw);
          (this.currentItem[0] as any).featured_item = num === 1 ? 1 : 0;
        }

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

    // quantity and price must be numbers
    if (isNaN(Number(itemToSave.quantity)) || isNaN(Number(itemToSave.price))) {
      this.updateMessage = 'Quantity and price must be numbers';
      this.updateIsError = true;
      return;
    }

    // quantity and price must be zero or higher
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
      // show basic error details if the update fails
      error: (err) => {
        console.error('Update error', err);
        this.updateMessage =
          (err?.error && err.error.message) ||
          (err?.message) ||
          'Update failed';
        this.updateIsError = true;
      }
    });
  }

  // run when the user clicks Delete
  async onDelete() {
    const name = this.deleteName.trim();

    // name must not be empty
    if (!name) {
      this.deleteMessage = 'Enter name to delete';
      this.deleteIsError = true;
      return;
    }

    // name must not only be numbers
    if (/^\d+$/.test(name)) {
      this.deleteMessage = 'Name must include text, not just numbers';
      this.deleteIsError = true;
      return;
    }

    // confirmation before deleting
    const alert = await this.alertController.create({
      header: 'Confirm delete',
      message: `Are you sure you want to delete "${name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteItemFromApi(name);
          }
        }
      ]
    });

    await alert.present();
  }

  private deleteItemFromApi(name: string) {
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
      error: (err) => {
        console.error('Delete error', err);
        this.deleteMessage = 
          (err?.error && err.error.message) || 
          (err?.message) || 
          'Delete failed (Laptop cannot be deleted or name not found)';
        this.deleteIsError = true;
      }
    });
  }
}
