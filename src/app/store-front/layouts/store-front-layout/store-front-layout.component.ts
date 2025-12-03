import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from '../../components/front-navbar/front-navbar.component';
import { AuthService } from '@/auth/services/auth.service';

@Component({
  selector: 'app-store-front-layout',
  imports: [
    RouterOutlet,
    FrontNavbarComponent
  ],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { 

  authService = inject(AuthService);
  


}
