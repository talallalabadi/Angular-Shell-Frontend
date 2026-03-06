import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: false
})
export class TransferErrorComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the main page
  }
}
