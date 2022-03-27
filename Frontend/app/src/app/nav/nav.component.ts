import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/api/authentication.service';
import { UserService } from '../services/api/User.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnDestroy {
  name: string;
  subscription: Subscription;

  constructor(private userService: UserService, private authService: AuthenticationService, private router: Router) {
    this.subscription = userService.userInfo$.subscribe(ui => this.name = ui.name);
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.userService.getUserInfo()
        .subscribe({
          next: ui => this.name = ui.name
        });
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => { this.router.navigate(['login']); this.name = ""; },
      error: () => { this.router.navigate(['login']); this.name = ""; }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
