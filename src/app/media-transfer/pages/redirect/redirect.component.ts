import { OnInit} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaTransferService } from '../../../services/media-transfer.service';
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';

@Component({
    selector: 'redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.scss'],
    standalone: false
})
export class TransferRedirectComponent implements OnInit {
  @ViewChild(ProgressSpinnerComponent) spinner!: ProgressSpinnerComponent;
  constructor(private router: Router, private route: ActivatedRoute, private mediaTransferService: MediaTransferService) { }
  progress: number | null = null;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    const fileId = this.route.snapshot.queryParamMap.get('fileId');

    if (!token || !fileId) {
      this.router.navigate(['mediaTransfer/error']);
      return;
    }
    this.mediaTransferService.checkFileExists(token, fileId).subscribe({
      next: () => {
        const downloadUrl = this.mediaTransferService.getDownloadUrl(token, fileId);

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);


        this.router.navigate(['mediaTransfer/success']);

      },
      error: (err) => {
        console.error('File Not Found:', err);
        this.router.navigate(['mediaTransfer/error']);
      }

    });

  }

  startDownloadSimulation(): void {
    this.progress = 0;
    this.spinner.simulateProgress();
    setTimeout(() => {
      this.spinner.stopProgress(); // Stop spinner simulation after delay
      this.progress = 100;
    }, 15000); // Simulate 15-second download
  }
}
