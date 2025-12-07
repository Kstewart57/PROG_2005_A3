import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  readerOutline,
  duplicateOutline,
  buildOutline,
  peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    // register the icons used on each tab button. manual icon selection from ionic page
    addIcons({
      'reader-outline': readerOutline,
      'duplicate-outline': duplicateOutline,
      'build-outline': buildOutline,
      'people-outline': peopleOutline
    });
  }
}
