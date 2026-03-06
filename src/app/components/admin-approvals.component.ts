import { Component, OnInit } from '@angular/core';
import { AdminService, PendingUser } from '../services/admin.service';

@Component({
  selector: 'app-admin-approvals',
  templateUrl: './admin-approvals.component.html',
  styleUrls: ['./admin-approvals.component.scss'],
  standalone: false
})
export class AdminApprovalsComponent implements OnInit {
  pendingUsers: PendingUser[] = [];
  loading = false;
  errorMessage = '';
  private processingEmails = new Set<string>();

  private readonly approvePresentationMessage =
    "Presentation Mock: In the live system (codentv1a), this would approve/verify the user's account and send a notification.";

  private readonly rejectPresentationMessage =
    "Presentation Mock: In the live system (codentv1a), this would reject the request, prevent account activation, and send a notification.";

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.loading = true;
    this.adminService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers = users || [];
        this.errorMessage = '';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pending users', err);
        this.errorMessage = 'Unable to load pending user requests right now.';
        this.loading = false;
      }
    });
  }

  approveUser(user: PendingUser): void {
    alert(this.approvePresentationMessage);
    this.processUser(user, 'approve');
  }

  rejectUser(user: PendingUser): void {
    alert(this.rejectPresentationMessage);
    this.processUser(user, 'reject');
  }

  isProcessing(email: string | undefined): boolean {
    if (!email) {
      return false;
    }
    return this.processingEmails.has(email);
  }

  private processUser(user: PendingUser, action: 'approve' | 'reject'): void {
    if (!user.email) {
      return;
    }

    if (this.processingEmails.has(user.email)) {
      return;
    }

    this.processingEmails.add(user.email);

    const request$ =
      action === 'approve'
        ? this.adminService.approveUser(user.email)
        : this.adminService.rejectUser(user.email);

    request$.subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter((pendingUser) => pendingUser.email !== user.email);
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(`Error trying to ${action} user`, err);
        this.errorMessage = `Unable to ${action} user. Please try again.`;
      },
      complete: () => {
        this.processingEmails.delete(user.email);
      }
    });
  }
}

