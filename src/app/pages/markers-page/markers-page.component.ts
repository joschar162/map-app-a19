import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

import {
  FullscreenControl,
  LngLatLike,
  Map,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'maplibre-gl';

import { environment } from '../../../environments/environment';
import { MapMouseEvent } from 'maplibre-gl';
import { v4 as uuIdV4 } from 'uuid';
import { JsonPipe } from '@angular/common';

const myMapTilerKey = environment.maptilerKey;

interface MyMarker {
  id: string;
  mapTilerMarker: Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('marker');
  map = signal<Map | null>(null);
  markers = signal<MyMarker[]>([]);

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

    // const marker = new Marker({
    //   draggable: true,
    // })
    //   .setLngLat([-72.9445, -14.3896])
    //   .addTo(map);

    // marker.on('dragend', (event) => {
    //   console.log(event);
    // });

    this.mapListeners(map);
  }

  mapListeners(map: Map) {
    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;

    const coords = event.lngLat;

    this.setMarker(map, coords);

    // console.log(event.lngLat.lng);
  }

  setMarker(map: Map, coords: LngLatLike) {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const mapTilerMarker = new Marker({
      draggable: true,
      color: color,
    })
      // .setLngLat([lng, lat])
      .setLngLat(coords)
      .addTo(map);

    const myNewMarker: MyMarker = {
      id: uuIdV4(),
      mapTilerMarker: mapTilerMarker,
    };

    // this.markers.set([myNewMarker, ...this.markers()]);
    this.markers.update((markers) => [myNewMarker, ...markers]);

    console.log(this.markers());
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }
}
