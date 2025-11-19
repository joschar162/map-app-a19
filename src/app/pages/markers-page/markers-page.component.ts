import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

import {
  FullscreenControl,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl';

import { environment } from '../../../environments/environment';

const myMapTilerKey = environment.maptilerKey;

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('marker');
  map = signal<Map | null>(null);
  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const map = new Map({
      container: element,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${myMapTilerKey}`,
      center: [-72.9445, -14.3896], // posición inicial [lng - lat]
      zoom: 16,
    });

    const marker = new Marker({
      draggable: true,
    })
      .setLngLat([-72.9445, -14.3896])
      .addTo(map);

    marker.on('dragend', (event) => {
      console.log(event);
    });

    this.mapListeners(map);
  }
  mapListeners(map: Map) {
    console.log('object');
  }
}
