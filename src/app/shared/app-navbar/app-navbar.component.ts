import { Component, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './app-navbar.component.html',
})
export class NavbarComponent {
  router = inject(Router);
  routes = routes
    .map((route) => ({
      path: route.path,
      title: `${route.title ?? 'Maps en Angular'}`,
    }))
    .filter((route) => route.path != '**');

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.url),
    map((url) => {
      // 1. Intenta encontrar el título de una ruta con coincidencia exacta (ej: /fullscreen)
      const exactMatch = routes.find(
        (route) => `/${route.path}` === url
      )?.title;

      if (exactMatch) {
        console.log('exactMatch: ' + exactMatch);
        return exactMatch;
      }
      // 2. Si no hay coincidencia exacta, usa el título de la ruta comodín (**)
      const wildcardRoute = routes.find((route) => route.path === '**');

      // Asegúrate de que la ruta comodín exista y tenga un título definido
      return wildcardRoute?.title ?? 'Título por Defecto';
    })
  );
}
