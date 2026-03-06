import { AfterViewInit, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-ad-unit',
    templateUrl: './ad-unit.component.html',
    styleUrls: ['./ad-unit.component.scss'],
    standalone: false
})
export class AdUnitComponent implements OnInit, AfterViewInit {
  @Input() adSlot: string;
  @Input() adFormat = 'auto';
  @Input() display = 'block';
  @Input() width = 320;
  @Input() height = 100;
  @Input() adClass = '';
  @Input() layoutKey: string = null;

  isLocalEnvironment = false;

  constructor() { }

  ngOnInit() {
    // Check if we're in a local environment
    this.isLocalEnvironment = window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1' ||
                             !environment.production;
  }

  ngAfterViewInit() {
    // Don't try to initialize ads in local environment
    if (this.isLocalEnvironment) {
      console.log('AdSense ads are not displayed in local development environments due to Google policy. ' +
                 'Mock ads are displayed instead. Real ads will appear when deployed to an approved domain.');
      return;
    }

    // Push the ad after the view is initialized
    try {
      // Check if adsbygoogle is available
      if (typeof window['adsbygoogle'] === 'undefined') {
        console.warn('AdSense script not loaded properly. Check for ad blockers or script loading issues.');
        return;
      }

      const adsbygoogle = window['adsbygoogle'];
      adsbygoogle.push({});
      console.log('Ad push attempt successful for ad slot:', this.adSlot);
    } catch (e) {
      console.error('Error initializing AdSense ad:', e);
      console.log('Ad configuration:', {
        slot: this.adSlot,
        format: this.adFormat,
        width: this.width,
        height: this.height
      });
    }
  }
}
