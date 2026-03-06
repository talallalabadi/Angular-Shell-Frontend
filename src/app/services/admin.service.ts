import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PendingUser {
  firstName: string;
  lastName: string;
  email: string;
  isVerified?: number | null;
  previouslyVerified?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  getPendingUsers(): Observable<PendingUser[]> {
    console.log('MOCK MODE: Loading pending user approvals (presentation-only).');
    return of([
      {
        firstName: 'Jordan',
        lastName: 'Lee',
        email: 'jordan.lee@example.com',
        isVerified: 0,
        previouslyVerified: null
      },
      {
        firstName: 'Taylor',
        lastName: 'Nguyen',
        email: 'taylor.nguyen@example.com',
        isVerified: 0,
        previouslyVerified: null
      }
    ]);
  }

  approveUser(email: string): Observable<{ success: boolean; message: string }> {
    console.log('MOCK MODE: Approval requested for', email);
    return of({ success: true, message: 'Presentation Mode: User Approved' });
  }

  rejectUser(email: string): Observable<{ success: boolean; message: string }> {
    console.log('MOCK MODE: Rejection requested for', email);
    return of({ success: true, message: 'Presentation Mode: User Rejected' });
  }
}

