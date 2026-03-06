import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AddMediaService } from '../services/addmedia.service';

/**
 * The magazine object to create.
 */
export class Radio {
  name = '';
  url = '';
  country = '';
  state = '';
  city = '';
}

@Component({
  selector: 'app-addRadio',
  templateUrl: './addRadio.component.html',
  styleUrls: ['./addRadio.component.scss'],
  standalone: false
})
/**
 * Adds a new radio to the database.
 */
export class AddRadioComponent implements OnInit {
  radio: Radio = new Radio();

  // UI state
  submitting = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {}

  constructor(private addMediaService: AddMediaService) {}

  /**
   * Sends the new radio to the database and displays a response message.
   */
  addRadio(): void {
    // clear messages
    this.successMessage = '';
    this.errorMessage = '';

    // client side checks
    if (!this.checkFilled()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.isValidUrl(this.radio.url)) {
      this.errorMessage = 'Please enter a valid URL including http:// or https://';
      return;
    }

    this.submitting = true;

    // pass the Radio to backend
    this.addMediaService.addRadioToDatabase(this.radio).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.successMessage = 'Radio station added successfully.';
        this.errorMessage = '';
        this.radio = new Radio(); 
        setTimeout(() => (this.successMessage = ''), 3500);
      },
      error: (err: any) => {
        this.submitting = false;
        console.error('Add radio error', err);
        if (err?.error?.message) {
          this.errorMessage = `Error: ${err.error.message}`;
        } else if (err?.status === 401) {
          this.errorMessage = 'Unauthorized — please log in.';
        } else {
          this.errorMessage = 'Failed to add radio station. Check server logs.';
        }
      }
    });
  }

  /**
   * Validates criteria
   */
  checkFilled(): boolean {
    return (
      this.radio.name.trim() !== '' && this.radio.url.trim() !== '' &&
      this.radio.country.trim() !== '' && this.radio.state.trim() !== '' && this.radio.city.trim() !== ''
    );
  }

  /**
   *URL check
   */
  isValidUrl(url?: string): boolean {
    if (!url) return false;
    try {
      const p = new URL(url);
      return p.protocol === 'http:' || p.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
