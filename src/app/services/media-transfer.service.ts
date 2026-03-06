import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaTransferService {
  // serverUrl refers to backend URL
  private apiURL = `${environment.serverUrl}/media-transfer`;

  constructor(private httpClient: HttpClient) { }

  createTransfer(payload: {
    transferId?: string;
    recipients: string[];
    senderEmail?: string;
    subject?: string;
    body?: string;
    usageLimit?: number;
    files: File[];
  }): Observable<HttpEvent<any>> {
    const formData = new FormData();
    if (payload.transferId) {
      formData.append('transferId', payload.transferId);
    }
    formData.append('recipients', payload.recipients.join(','));
    if (payload.senderEmail) {
      formData.append('senderEmail', payload.senderEmail);
    }
    if (payload.subject) {
      formData.append('subject', payload.subject);
    }
    if (payload.body) {
      formData.append('body', payload.body);
    }
    if (typeof payload.usageLimit === 'number') {
      formData.append('usageLimit', String(payload.usageLimit));
    }

    payload.files.forEach(file => {
      formData.append('files', file);
    });

    return this.httpClient.post(`${this.apiURL}/create-transfer`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadFile(tokenOrTransferId: string, fileId: string): Observable<any> {
    return this.httpClient.get(`${this.apiURL}/get-media-link/${tokenOrTransferId}/${fileId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  getDownloadUrl(tokenOrTransferId: string, fileId: string): string {
    return `${this.apiURL}/get-media-link/${tokenOrTransferId}/${fileId}`;
  }

  checkFileExists(tokenOrTransferId: string, fileId: string): Observable<any> {
    return this.httpClient.head(`${this.apiURL}/get-media-link/${tokenOrTransferId}/${fileId}`, { observe: 'response' });
  }

  getAdminTransfers(filters: {
    page?: number;
    pageSize?: number;
    fileName?: string;
    senderEmail?: string;
    recipientEmail?: string;
    status?: 'active' | 'expired' | '';
  }): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.httpClient.get(`${this.apiURL}/admin/transfers`, { params });
  }

  deleteAdminTransfer(transferId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiURL}/admin/transfers/${encodeURIComponent(transferId)}`);
  }

  bulkDeleteAdminTransfers(transferIds: string[]): Observable<any> {
    return this.httpClient.post(`${this.apiURL}/admin/transfers/bulk-delete`, { transferIds });
  }

  extendAdminTransferExpiry(transferId: string, days: number): Observable<any> {
    return this.httpClient.patch(`${this.apiURL}/admin/transfers/${encodeURIComponent(transferId)}/extend`, { days });
  }

  getAdminTransferDownloads(transferId: string, filters: {
    page?: number;
    pageSize?: number;
    success?: 'true' | 'false' | '';
    fileName?: string;
    recipientEmail?: string;
  }): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.httpClient.get(`${this.apiURL}/admin/transfers/${encodeURIComponent(transferId)}/downloads`, { params });
  }

}
