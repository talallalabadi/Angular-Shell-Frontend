import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AdService } from '../../services/ad.service';

@Component({
    selector: 'app-ad-debug',
    templateUrl: './ad-debug.component.html',
    styleUrls: ['./ad-debug.component.scss'],
    standalone: false
})
export class AdDebugComponent implements OnInit {
  adStatus: {loaded: boolean, errors: string[]};
  isLocalEnvironment = false;

  constructor(public adService: AdService) { }

  ngOnInit() {
    this.isLocalEnvironment = this.adService.isLocalEnvironment();
    this.adStatus = this.adService.checkAdSenseStatus();
  }

  checkStatus() {
    this.adStatus = this.adService.checkAdSenseStatus();
  }
}
