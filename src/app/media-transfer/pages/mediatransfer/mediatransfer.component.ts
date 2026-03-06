import { OnInit} from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MediaTransferService } from '../../../services/media-transfer.service';
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';

interface AdminTransfer {
  id: number;
  transferId: string;
  senderEmail: string;
  uploadDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
  totalSizeBytes: number;
  storageProvider: string;
  fileNames: string[];
  recipients: string[];
}

interface DownloadAttempt {
  id: number;
  fileName: string;
  recipientEmail: string;
  attemptedAt: string;
  success: boolean;
  ipAddress: string;
  errorMessage: string | null;
}

@Component({
    selector: 'app-mediatransfer',
    templateUrl: './mediatransfer.component.html',
    styleUrls: ['./mediatransfer.component.scss'],
    standalone: false
})
export class TransferComponent implements OnInit {
  @ViewChild(ProgressSpinnerComponent) spinner!: ProgressSpinnerComponent;

  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  warningMessage = '';
  errorMessage = '';
  successMessage = '';
  selectedFiles: File[] = [];
  subject = '';
  body = '';
  sender = '';
  showEmailForm = false;
  fileSelected = false;
  isUploading = false;
  uploadProgress: number | null = null;
  recipientEmails: string[] = [];
  currentEmail = '';
  uid = '';
  adminLoading = false;
  adminMessage = '';
  adminError = '';
  adminTransfers: AdminTransfer[] = [];
  adminFilters: {
    page: number;
    pageSize: number;
    fileName: string;
    senderEmail: string;
    recipientEmail: string;
    status: '' | 'active' | 'expired';
  } = {
      page: 1,
      pageSize: 20,
      fileName: '',
      senderEmail: '',
      recipientEmail: '',
      status: ''
    };
  extendDaysByTransferId: { [transferId: string]: number } = {};
  bulkDeleteInput = '';
  bulkDeleteSummary: { deleted: any[]; failed: any[] } | null = null;
  selectedHistoryTransferId = '';
  historyFilters: {
    page: number;
    pageSize: number;
    success: '' | 'true' | 'false';
    fileName: string;
    recipientEmail: string;
  } = {
      page: 1,
      pageSize: 50,
      success: '',
      fileName: '',
      recipientEmail: ''
    };
  downloadHistory: DownloadAttempt[] = [];
  historyPagination = {
    page: 1,
    pageSize: 50,
    totalRecords: 0
  };

  constructor(private mediaTransferService: MediaTransferService) {}

  ngOnInit() {
  }

  onFileSelected(event: any): void {
    this.addFiles(event);
    if(this.selectedFiles.length > 0){
      this.fileSelected = true;
      this.showEmailForm = true;
    }
  }

  addFiles(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
    event.target.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this.fileSelected = false;
      this.isUploading = false;
      this.showEmailForm = false;
    }
  }

  addEmail(event: KeyboardEvent): void {
    event.preventDefault();
    this.commitPendingEmail();
  }

  addEmailOnBlur(): void {
    this.commitPendingEmail();
  }

  removeEmail(email: string): void {
    this.recipientEmails = this.recipientEmails.filter(e => e !== email);
  }

  downloadFile(username: string, fileId: string): void {

      this.mediaTransferService.downloadFile(username, fileId).subscribe(
        (response: any) => {
          this.successMessage = response.message;
          this.errorMessage = '';


        },
        (error) => {
          this.errorMessage = error.error?.message || 'An error occurred while downloading the file';
          this.successMessage = '';


        }
      );

  }

  private commitPendingEmail(): void {
    const trimmed = this.currentEmail.trim();
    if (trimmed.match(this.emailRegex) && !this.recipientEmails.includes(trimmed)) {
      this.recipientEmails.push(trimmed);
    }
    this.currentEmail = '';
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.warningMessage = '';
  }

  private resetAdminMessages(): void {
    this.adminMessage = '';
    this.adminError = '';
  }

  uploadFile(): void {
    this.resetMessages();
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    if (this.recipientEmails.length === 0) {
      this.warningMessage = 'Please enter at least one valid email.';
      this.errorMessage = '';
      this.successMessage = '';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.spinner.simulateProgress();

    this.uid = self.crypto.randomUUID();
    this.mediaTransferService.createTransfer({
      transferId: this.uid,
      recipients: this.recipientEmails,
      senderEmail: this.sender,
      subject: this.subject,
      body: this.body,
      files: this.selectedFiles
    })
      .pipe(finalize(() => {
        this.isUploading = false;
        this.spinner.stopProgress();
      }))
      .subscribe(
      (response: any) => {
        if (response.type === HttpEventType.Response) {
          this.successMessage = 'Transfer created and emails sent successfully!';
          this.errorMessage = '';
          this.warningMessage = '';
          this.uploadProgress = 100;
        }
      },
      (error) => {
        console.error('Upload error:', error);
        this.errorMessage = error.status === 413
          ? 'One of the files exceeds the 10 GB size limit.'
          : error.error?.message || 'An error occurred while uploading the files';

        this.successMessage = '';
        this.warningMessage = '';
        this.uploadProgress = null;
      }
    );
  }

  loadAdminTransfers(): void {
    this.resetAdminMessages();
    this.adminLoading = true;
    this.mediaTransferService.getAdminTransfers(this.adminFilters)
      .pipe(finalize(() => (this.adminLoading = false)))
      .subscribe(
        (response: any) => {
          this.adminTransfers = Array.isArray(response?.transfers) ? response.transfers : [];
          this.adminMessage = `Loaded ${this.adminTransfers.length} transfer(s).`;
          this.bulkDeleteSummary = null;
        },
        (error) => {
          this.adminError = error?.error?.message || 'Failed to load transfers';
          this.adminTransfers = [];
        }
      );
  }

  deleteTransfer(transferId: string): void {
    if (!transferId) return;
    this.resetAdminMessages();
    this.adminLoading = true;
    this.mediaTransferService.deleteAdminTransfer(transferId)
      .pipe(finalize(() => (this.adminLoading = false)))
      .subscribe(
        (response: any) => {
          this.adminMessage = response?.message || 'Transfer deleted';
          this.adminTransfers = this.adminTransfers.filter((transfer) => transfer.transferId !== transferId);
        },
        (error) => {
          this.adminError = error?.error?.message || 'Failed to delete transfer';
        }
      );
  }

  runBulkDelete(): void {
    this.resetAdminMessages();
    const transferIds = this.bulkDeleteInput
      .split(/[\s,\n]+/)
      .map((id) => id.trim())
      .filter((id) => !!id);

    if (transferIds.length === 0) {
      this.adminError = 'Enter at least one transfer ID.';
      return;
    }

    this.adminLoading = true;
    this.mediaTransferService.bulkDeleteAdminTransfers(transferIds)
      .pipe(finalize(() => (this.adminLoading = false)))
      .subscribe(
        (response: any) => {
          this.bulkDeleteSummary = response || { deleted: [], failed: [] };
          const deletedIds = (response?.deleted || []).map((item: any) => item.transferId);
          if (deletedIds.length > 0) {
            this.adminTransfers = this.adminTransfers.filter((transfer) => !deletedIds.includes(transfer.transferId));
          }
          this.adminMessage = 'Bulk delete completed.';
        },
        (error) => {
          this.bulkDeleteSummary = null;
          this.adminError = error?.error?.message || 'Failed bulk delete';
        }
      );
  }

  extendTransferExpiry(transferId: string): void {
    this.resetAdminMessages();
    const days = Number(this.extendDaysByTransferId[transferId]);
    if (!Number.isInteger(days) || days <= 0) {
      this.adminError = 'Days must be a positive integer.';
      return;
    }

    this.adminLoading = true;
    this.mediaTransferService.extendAdminTransferExpiry(transferId, days)
      .pipe(finalize(() => (this.adminLoading = false)))
      .subscribe(
        (response: any) => {
          this.adminMessage = response?.message || 'Expiry extended';
          const target = this.adminTransfers.find((transfer) => transfer.transferId === transferId);
          if (target && response?.newExpiryDate) {
            target.expiryDate = response.newExpiryDate;
            target.status = 'active';
          }
        },
        (error) => {
          this.adminError = error?.error?.message || 'Failed to extend expiry';
        }
      );
  }

  loadDownloadHistory(transferId?: string): void {
    this.resetAdminMessages();
    const targetTransferId = (transferId || this.selectedHistoryTransferId || '').trim();
    if (!targetTransferId) {
      this.adminError = 'Provide a transfer ID for download history.';
      return;
    }

    this.selectedHistoryTransferId = targetTransferId;
    this.adminLoading = true;
    this.mediaTransferService.getAdminTransferDownloads(targetTransferId, this.historyFilters)
      .pipe(finalize(() => (this.adminLoading = false)))
      .subscribe(
        (response: any) => {
          this.downloadHistory = Array.isArray(response?.downloads) ? response.downloads : [];
          this.historyPagination = {
            page: response?.pagination?.page || this.historyFilters.page,
            pageSize: response?.pagination?.pageSize || this.historyFilters.pageSize,
            totalRecords: response?.pagination?.totalRecords || 0
          };
          this.adminMessage = `Loaded ${this.downloadHistory.length} download event(s) for ${targetTransferId}.`;
        },
        (error) => {
          this.downloadHistory = [];
          this.historyPagination = { page: 1, pageSize: 50, totalRecords: 0 };
          this.adminError = error?.error?.message || 'Failed to load download history';
        }
      );
  }
}
