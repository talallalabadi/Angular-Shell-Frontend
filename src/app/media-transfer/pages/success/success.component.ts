import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss'],
    standalone: false
})
export class TransferSuccessComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the main page
  }
}
