import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { Map, Marker } from 'maplibre-gl';
import { environment } from '../../../../environments/environment';

const myMapTilerKey = environment.maptilerKey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `


  `,
})
export class MiniMapComponent {
  divElement = viewChild<ElementRef>('mapRef');
  map = signal<Map | null>(null);
  myZoom = signal(14);

  lngLat = input.required<{ lng: number; lat: number }>();

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const { lng, lat } = this.lngLat();
    const map = new Map({
      container: element,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${myMapTilerKey}`,
      center: [lng, lat],
      zoom: this.myZoom(),
      interactive: false,
      pitch: 50,
    });
    new Marker().setLngLat([lng, lat]).addTo(map);
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }
}
