import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-navbar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './front-navbar.component.html',
  styles: `
    .title-shop {
      font-family: 'Montserrat', sans-serif;
    }
  `
})
export class FrontNavbarComponent { }
