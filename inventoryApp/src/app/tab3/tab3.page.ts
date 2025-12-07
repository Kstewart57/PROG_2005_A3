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
  // Track Dark Mode is active
  isDarkMode = false;

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  ionViewWillEnter() {
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  toggleDarkMode(event: any) {
    this.isDarkMode = event.detail.checked;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  // name typed into the search box
  searchName = '';

  // item list returned from the API
  currentItem: Item[] = [];

  // name typed into the delete box
  deleteName = '';

  // delete feedback text
  deleteMessage = '';
  deleteIsError = false;

  // search + final update feedback text (under Find item)
  formMessage = '';
  formIsError = false;

  // update validation/API feedback text (under Save changes)
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

        // message based on result (under Find item)
        if (this.currentItem.length) {
          this.formMessage = 'Item found';
          this.formIsError = false;
        } else {
          this.currentItem = [];
          this.formMessage = 'Item not found';
          this.formIsError = true;
        }

        // clear delete + update messages when searching
        this.deleteMessage = '';
        this.deleteIsError = false;
        this.updateMessage = '';
        this.updateIsError = false;
      },
      // if the call fails, clear the item and show an error
      error: () => {
        this.currentItem = [];
        this.searchName = '';
        this.formMessage = 'Item not found';
        this.formIsError = true;

        this.deleteMessage = '';
        this.deleteIsError = false;
        this.updateMessage = '';
        this.updateIsError = false;
      }
    });
  }

  // run when the user clicks Save changes if an item is selected
  async onUpdate() {
    // make sure an item is loaded
    if (!this.currentItem.length || !this.currentItem[0]) {
      this.updateMessage = 'Search for an item before saving changes';
      this.updateIsError = true;
      return;
    }

    const itemToSave = this.currentItem[0];

    // supplier must not be empty
    const supplier = (itemToSave.supplier_name || '').trim();
    if (!supplier) {
      this.updateMessage = 'Supplier name is required';
      this.updateIsError = true;
      return;
    }

    // supplier must not only be numbers
    if (/^\d+$/.test(supplier)) {
      this.updateMessage = 'Supplier name must include letters, not just numbers';
      this.updateIsError = true;
      return;
    }

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

    // confirmation before updating
    const alert = await this.alertController.create({
      header: 'Confirm update',
      message: `Save changes to "${itemToSave.item_name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          role: 'destructive',
          handler: () => {
            this.updateItemInApi(itemToSave);
          }
        }
      ]
    });

    await alert.present();
  }

  // helper to call the API for update
  private updateItemInApi(itemToSave: Item) {
    this.inventoryService.updateItem(itemToSave.item_name, itemToSave).subscribe({
      next: () => {
        // SUCCESS: replace "Item found" with "Item updated" in the Find area
        this.formMessage = 'Item updated';
        this.formIsError = false;

        // clear any previous update error under Save changes
        this.updateMessage = '';
        this.updateIsError = false;

        // clear delete message
        this.deleteMessage = '';
        this.deleteIsError = false;

        // clear edit form and search box after successful update
        this.currentItem = [];
        this.searchName = '';
      },
      error: (err) => {
        console.error('Update error', err);
        // ERROR: show under Save changes only
        this.updateMessage =
          (err?.error && err.error.message) ||
          (err?.message) ||
          'Update failed';
        this.updateIsError = true;

        this.deleteMessage = '';
        this.deleteIsError = false;
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

        // clear delete box
        this.deleteName = '';

        // clear search/update message
        this.formMessage = '';
        this.formIsError = false;
        this.updateMessage = '';
        this.updateIsError = false;

        // after deletion clear the item if it was on screen
        if (this.currentItem[0]?.item_name === name) {
          this.currentItem = [];
          this.searchName = '';
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

        this.formMessage = '';
        this.formIsError = false;
        this.updateMessage = '';
        this.updateIsError = false;
      }
    });
  }
}

