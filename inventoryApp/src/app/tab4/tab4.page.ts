import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton],
})
export class Tab4Page {
  constructor(private alertController: AlertController) {}

  // show help information in a popup
  async showHelpAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Privacy & Security help',
      message:
        '• This page explains how the app stores and protects inventory data.\n' +
        '• Only item details (like name, category, quantity, price and supplier) are stored.\n' +
        '• No customer or payment information is collected.\n' +
        '• Use the tabs at the bottom to move between pages:\n' +
        '   - Home: view all inventory items.\n' +
        '   - Add: create a new item.\n' +
        '   - Update / Delete: find, edit or delete an item.\n' +
        '   - Privacy & Security: read about data handling and app behaviour.',
      buttons: ['OK'],
      cssClass: 'help-alert'
    });

    await alert.present();
  }
}
