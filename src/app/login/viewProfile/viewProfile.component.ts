import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './viewProfile.component.html',
  styleUrls: ['./viewProfile.component.scss']
})
export class ViewProfileComponent {
  user: User;

  constructor(private auth: AuthService) {
    this.user = this.auth.currentUserValue;
  }
}
