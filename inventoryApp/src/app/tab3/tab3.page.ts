/*
  Assignment 3: Inventory Update/Delete Tab
  Author: Stephen Travers 23885594
  Description: Tab for finding, updating and deleting inventory items using the API.
*/

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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

  // inject the inventory API service
  constructor(private inventoryService: InventoryService) {}

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
      next: (items) => {
        console.log('SEARCH RESULT', items);
        this.currentItem = items as Item[];

        // simple message based on result
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
    if (!this.currentItem.length) {
      return;
    }

    const itemToSave = this.currentItem[0];

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
        this.deleteMessage = res.message || 'Deleted';
        this.deleteIsError = false;

        // after deletion clear the item
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

