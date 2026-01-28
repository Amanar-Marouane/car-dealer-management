import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any;
  private sub?: Subscription;

  constructor(
    @Inject(AuthService) private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sub = this.auth.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
