import {
  Component,
  viewChild,
  ElementRef,
  AfterViewInit,
  signal,
  effect,
} from '@angular/core';

import { environment } from '../../../environments/environment';
import { Map } from 'maplibre-gl';
import { DecimalPipe } from '@angular/common';

const myMapTilerKey = environment.maptilerKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.css',
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<Map | null>(null);
  myZoom = signal(14);

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.myZoom());
    // this.map()?.zoomTo(this.myZoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const initialState = { lng: -77.0428, lat: -12.0464, zoom: this.myZoom() };
    const map = new Map({
      container: element,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${myMapTilerKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
    this.mapListeners(map);
  }

  mapListeners(map: Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.myZoom.set(newZoom);
    });

    this.map.set(map);
  }
}
