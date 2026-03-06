import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoEditorStateService {
    videoSource = '';
    ccSource = '';
    featuredDetails: any = {}; // This can store metadata if needed
}
