import { Component, viewChild, ElementRef, AfterViewInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Map } from 'maplibre-gl';

const myMapTilerKey = environment.maptilerKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
div{
  width:100vw;
  height:calc(100vh - 64px);

}
`,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  async ngAfterViewInit() {
    if (!this.divElement()?.nativeElement) return;
    await new Promise((resolve) => setTimeout(resolve, 80));
    const element = this.divElement()!.nativeElement;

    const initialState = { lng: -77.0428, lat: -12.0464, zoom: 9 };
    const map = new Map({
      container: element,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${myMapTilerKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
  }
}
