import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  // Ad slots for different placements - using actual ad slot IDs from Google AdSense
  readonly adSlots = {
    sidebar: '3647265227',    // Sidebar display ad
    betweenResults: '7741588754', // In-feed ad for between results
    banner: '5411106757',     // Banner display ad
    footer: '5411106757'      // Footer display ad (same as banner for now)
  };

  // Ad formats for different placements
  readonly adFormats = {
    sidebar: 'auto',
    betweenResults: 'fluid',
    banner: 'auto',
    footer: 'auto'
  };

  // Layout keys for special ad formats (currently only needed for in-feed ads)
  readonly layoutKeys = {
    betweenResults: '-ef+6k-30-ac+ty' // In-feed layout key
  };

  // Sizes for different ad formats - you can adjust these based on your layout
  readonly adSizes = {
    sidebar: { width: 300, height: 600 },
    betweenResults: { width: 728, height: 90 },
    banner: { width: 728, height: 90 },
    footer: { width: 728, height: 90 }
  };

  // Whether to show ads based on user's authentication status
  showAds(isAuthenticated: boolean, isGuestUser: boolean): boolean {
    // Only show ads for non-authenticated users and guest users
    return !isAuthenticated || isGuestUser;
  }

  // Get responsive size based on screen width
  getResponsiveAdSize(type: string): {width: number, height: number} {
    const size = this.adSizes[type];

    // For smaller screens, adjust the sizes
    if (window.innerWidth < 768) {
      if (type === 'betweenResults' || type === 'banner' || type === 'footer') {
        return { width: 320, height: 100 };
      }
    }

    return size;
  }

  // Get layout key for special ad formats if available
  getLayoutKey(type: string): string | null {
    return this.layoutKeys[type] || null;
  }

  // Get ad format for specific placement
  getAdFormat(type: string): string {
    return this.adFormats[type] || 'auto';
  }

  // Check if we're in a local environment
  isLocalEnvironment(): boolean {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           !environment.production;
  }

  // Debug function to check AdSense status
  checkAdSenseStatus(): {loaded: boolean, errors: string[]} {
    const errors = [];

    // Check if script is loaded
    if (typeof window['adsbygoogle'] === 'undefined') {
      errors.push('AdSense script not loaded properly');
    }

    // Check if we're in local environment
    if (this.isLocalEnvironment()) {
      errors.push('Running in local environment - ads will not display');
    }

    // Check if ad blockers might be active
    if (document.querySelector('.adsbygoogle[data-adsbygoogle-status="done"]') === null) {
      errors.push('No ads successfully initialized - possible ad blocker active');
    }

    return {
      loaded: typeof window['adsbygoogle'] !== 'undefined',
      errors
    };
  }
}
