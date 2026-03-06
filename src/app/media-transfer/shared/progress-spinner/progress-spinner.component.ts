import { Component, Input } from '@angular/core';

@Component({
    selector: 'progress-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    standalone: false
})
export class ProgressSpinnerComponent {
  @Input() isLoading = false; // Controls spinner visibility
  @Input() progress: number | null = null; // Progress percentage (0-100)

  private cancelProgress = false; // Flag to cancel progress updates

  simulateProgress(): void {
    this.cancelProgress = false;
    this.progress = 5;
    let currentDelay = 1000;
    let increment = 4;

    const updateProgress = () => {
      if (this.cancelProgress || this.progress === null || this.progress >= 100) {
        return;
      }

      if (this.progress < 65) {
        increment = 4;
        currentDelay = 1000;
      } else if (this.progress < 95) {
        increment = 4;
        currentDelay = 6000;
      } else {
        return; // Stop at 95%, wait for results
      }

      this.progress += increment;

      if (this.progress >= 95) {
        this.progress = 95; // Cap progress at 95%
      }

      // Next increment
      setTimeout(updateProgress, currentDelay);
    };

    updateProgress(); // Start progress update loop
  }

  stopProgress(): void {
    this.cancelProgress = true;
  }
}
