import type { AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Component, HostListener, ViewChild } from '@angular/core';
import { VideoEditorStateService } from '../services/video-editor-state.service';
import { Router } from '@angular/router';

interface EditorAction {
  type: 'cut' | 'delete';
  payload: any;
}

@Component({
    selector: 'app-video-editor',
    templateUrl: './video-editor.component.html',
    styleUrls: ['./video-editor.component.css'],
    standalone: false
})

export class VideoEditorComponent implements OnInit, AfterViewInit {

    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    @ViewChild('captionTrack') captionTrack!: ElementRef<HTMLTrackElement>;
    currentTime = 0;
    isPlaying = false;
    isMuted = false;
    captionsEnabled = false;
    volumeSliderVisible = false;
    currentVolume = 1;  // Default volume is max (1.0)
    playbackSpeeds: number[] = [0.5, 1, 1.5, 2];  // Speeds to choose from
    currentPlaybackSpeed = 1;  // Default speed (1x)
    private isDraggingPlayhead = false;
    cutMarkers: number[] = []; // Stores timestamps for cuts
    deleteMode = false;
    selectedDeleteRange: { start: number, end: number } | null = null;
    processedSegments: { start: number, end: number }[] = [];
    currentSegmentIndex = 0;

    undoStack: EditorAction[] = [];
    redoStack: EditorAction[] = [];

    filterControlsVisible = false;
    filterSettings = {
      hue: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1
    };

    transcriptVisible = false;
    captions: string[] = [];
    captionsForTranscript: string[] = [];
    videoHeight = 300; // Default height
    startTime = 0;
    endTime = 10;



    // Original sources from the database
    originalVideoSource = '';
    originalCcSource = '';
    videoSource = '';
    ccSource = '';
    segments: { start: number, end: number }[] = [];

    featuredDetails: any = {};

    videoDuration = 0;  // Store video duration for timeline scaling
    timelineMarkers: { time: number, label?: string }[] = [];
    thumbnails: { time: number, image: string }[] = [];

    @ViewChild('thumbnailCanvas') thumbnailCanvas!: ElementRef<HTMLCanvasElement>;

    thumbnailVisible = false;
    thumbnailX = 0;
    thumbnailY = 0;
    private offscreenVideo!: HTMLVideoElement;


    constructor(
        private videoEditorStateService: VideoEditorStateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.originalVideoSource = this.videoEditorStateService.videoSource;
        this.originalCcSource = this.videoEditorStateService.ccSource;

        // Create working copies
        this.videoSource = this.originalVideoSource;
        this.ccSource = this.originalCcSource;
        this.videoDuration = 0;

        this.featuredDetails = this.videoEditorStateService.featuredDetails;

        if (!this.videoSource) {
          console.error('No videoSource found, redirecting...');
          // Optionally redirect to the search page if data is missing (due to refresh).
          this.router.navigate(['/search']);
        }
    }

    playSegment(index: number) {
      if (index >= this.segments.length) {
        this.videoPlayer.nativeElement.pause();
        return;
      }
      this.currentSegmentIndex = index;
      this.videoPlayer.nativeElement.currentTime = this.segments[index].start;
      this.videoPlayer.nativeElement.play();
    }

    startDraggingPlayhead(event: MouseEvent) {
      this.isDraggingPlayhead = true;
      this.updateTimeFromEvent(event);
    }

    dragPlayhead(event: MouseEvent) {
      if (this.isDraggingPlayhead) {
          this.updateTimeFromEvent(event);

          // Manually update both playhead and video position
          const timelineElement = event.currentTarget as HTMLDivElement;
          const rect = timelineElement.getBoundingClientRect();
          const offsetX = event.clientX - rect.left;
          const timelineWidth = timelineElement.clientWidth;

          const clickRatio = offsetX / timelineWidth;
          const seekTime = clickRatio * this.videoDuration;

          this.currentTime = seekTime; // Visually update playhead position
          this.videoPlayer.nativeElement.currentTime = seekTime; // Ensure video stays in sync
      }
    }


    formatTimeWithMilliseconds(time: number): string {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const milliseconds = Math.floor((time % 1) * 1000); // Extract milliseconds

      return `${this.padZero(minutes)}:${this.padZero(seconds)}:${this.padZero(milliseconds, 3)}`;
    }

    // Helper function to add leading zeros
    padZero(num: number, size: number = 2): string {
        return num.toString().padStart(size, '0');
    }




    stopDraggingPlayhead() {
        this.isDraggingPlayhead = false;
    }

    updateTimeFromEvent(event: MouseEvent) {
        const timelineElement = event.currentTarget as HTMLDivElement;
        const rect = timelineElement.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const timelineWidth = timelineElement.clientWidth;

        const clickRatio = offsetX / timelineWidth;
        const seekTime = clickRatio * this.videoDuration;

        this.goToTime(seekTime);
    }


    ngAfterViewInit() {
      const video = this.videoPlayer.nativeElement;

      video.addEventListener('loadedmetadata', () => {
        this.videoDuration = video.duration;
        this.generateThumbnails();
        this.segments = [{ start: 0, end: this.videoDuration }];
        this.setupCaptionListener();
      });

      video.addEventListener('timeupdate', () => {
        if (!this.isDraggingPlayhead) {
          this.currentTime = video.currentTime;
          // Automatically move to next segment if current segment ends
          const segment = this.segments[this.currentSegmentIndex];
          if (video.currentTime >= segment.end) {
            this.playSegment(this.currentSegmentIndex + 1);
          }
        }
      });

      this.playSegment(0);

      video.addEventListener('play', () => {
          this.isPlaying = true;
      });

      video.addEventListener('pause', () => {
          this.isPlaying = false;
      });

      video.addEventListener('volumechange', () => {
          this.isMuted = video.muted;
      });

      // Create an offscreen video element for generating thumbnails
      this.offscreenVideo = document.createElement('video');
      this.offscreenVideo.crossOrigin = 'anonymous';
      this.offscreenVideo.src = this.videoSource;
      this.offscreenVideo.load();

      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.videoDuration = this.videoPlayer.nativeElement.duration;
        // Start with a single segment representing the whole video
        this.segments = [{ start: 0, end: this.videoDuration }];
      });
    }

    toggleTranscript() {
      this.transcriptVisible = !this.transcriptVisible;
      if (this.transcriptVisible) {
        this.loadCaptions();
      }
    }

    setupCaptionListener() {
      const video = this.videoPlayer.nativeElement;
      const track = video.textTracks[0]; // Get the first track (English captions)

      if (track) {
        track.mode = 'hidden'; // Keep captions hidden from the video
        track.addEventListener('cuechange', () => {
          this.updateCaptions(track);
        });
      }
    }

    updateCaptions(track: TextTrack) {
      if (track.activeCues) {
        this.captions = Array.from(track.activeCues).map(cue => (cue as VTTCue).text);
      }
    }

    loadCaptions() {
      const video = this.videoPlayer.nativeElement;
      const track = video.textTracks[0]; // First text track (captions)

      if (track && track.cues) {
          this.captions = Array.from(track.cues).map(cue => {
              const startTime = this.formatTime(cue.startTime);
              const cueText = (cue as VTTCue).text; // Type casting to VTTCue
              return `${startTime} ${cueText}`;
          });
      } else {
          console.warn('No captions found.');
      }
    }


    async generateThumbnails() {
      this.thumbnails = []; // Reset thumbnails array
      const totalThumbnails = 20; // Number of thumbnails
      const interval = this.videoDuration / totalThumbnails; // Evenly space thumbnails
      const promises: Promise<{ time: number; image: string }>[] = [];

      for (let i = 0; i < totalThumbnails; i++) {
          const seekTime = i * interval;
          promises.push(this.captureThumbnail(seekTime)); // Capture thumbnail at each interval
      }

      // Wait for all thumbnails to load, then sort by time
      const loadedThumbnails = await Promise.all(promises);
      this.thumbnails = loadedThumbnails.sort((a, b) => a.time - b.time); // Ensure correct order
    }





    captureThumbnail(time: number): Promise<{ time: number; image: string }> {
      return new Promise((resolve) => {
          const tempVideo = document.createElement('video');
          tempVideo.src = this.videoSource;
          tempVideo.crossOrigin = 'anonymous';
          tempVideo.muted = true;
          tempVideo.currentTime = time;

          tempVideo.addEventListener('loadeddata', () => {
              const canvas = document.createElement('canvas');
              canvas.width = 160; // Adjust thumbnail size
              canvas.height = 90;
              const ctx = canvas.getContext('2d');

              if (ctx) {
                  ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
                  const thumbnailData = canvas.toDataURL();

                  resolve({ time, image: thumbnailData }); // Return thumbnail object
              }

              tempVideo.remove(); // Remove temporary video element
          });

          tempVideo.load();
      });
    }





    seekToTime(time: number) {
      this.videoPlayer.nativeElement.currentTime = time;
    }

    formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }






    goToTime(seconds: number) {
      this.videoPlayer.nativeElement.currentTime = seconds;
    }

    goBack(): void {
      this.router.navigate(['/search']); // Back to search or details page
    }

    timelineClicked(event: MouseEvent) {
      const timelineElement = event.currentTarget as HTMLDivElement;
      const rect = timelineElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const timelineWidth = timelineElement.clientWidth;

      const clickRatio = offsetX / timelineWidth;
      const seekTime = clickRatio * this.videoDuration;

      this.goToTime(seekTime);
    }


    togglePlayPause() {
      const video = this.videoPlayer.nativeElement;
      if (this.isPlaying) {
          video.pause();
      } else {
          video.play();
      }
    }

    toggleMute() {
      const video = this.videoPlayer.nativeElement;
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }

    toggleCaptions() {
      const video = this.videoPlayer.nativeElement;
      const tracks = video.textTracks;  // Grab all <track> elements associated with the video

      this.captionsEnabled = !this.captionsEnabled;  // Toggle the boolean

      for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = this.captionsEnabled ? 'showing' : 'disabled';
      }
    }

    showThumbnail(event: MouseEvent) {
      const timelineElement = event.currentTarget as HTMLDivElement;
      const rect = timelineElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const timelineWidth = timelineElement.clientWidth;
      const hoverTime = (offsetX / timelineWidth) * this.videoDuration;

      this.thumbnailX = event.clientX - 80; // center thumbnail horizontally
      this.thumbnailY = rect.top - 100; // position above the scrubber

      this.thumbnailVisible = true;
      this.captureThumbnail(hoverTime);
    }

    hideThumbnail() {
      this.thumbnailVisible = false;
    }

    showVolumeSlider() {
      this.volumeSliderVisible = true;
    }

    hideVolumeSlider() {
      this.volumeSliderVisible = false;
    }

    setVolume(event: Event) {
      const video = this.videoPlayer.nativeElement;
      const volume = (event.target as HTMLInputElement).valueAsNumber;

      video.volume = volume;
      this.currentVolume = volume;

      // Optionally, mute button icon can update if volume hits 0
      this.isMuted = volume === 0;
    }

    changePlaybackSpeed(event: Event) {
      const video = this.videoPlayer.nativeElement;
      const newSpeed = parseFloat((event.target as HTMLSelectElement).value);

      this.currentPlaybackSpeed = newSpeed;
      video.playbackRate = newSpeed;
    }

    setCut() {
      if (this.currentTime > 0 && this.currentTime < this.videoDuration) {
        this.cutMarkers.push(this.currentTime);
        this.cutMarkers.sort((a, b) => a - b);

        this.recordAction({
          type: 'cut',
          payload: { time: this.currentTime }
        });
      }
    }


    toggleDeleteMode() {
      this.deleteMode = !this.deleteMode;
      this.selectedDeleteRange = null; // Reset selection when toggling
    }


    selectCutRange(time: number) {
      if (!this.deleteMode) {
return;
}

      // Remove the clicked cut marker immediately
      this.cutMarkers = this.cutMarkers.filter(cut => cut !== time);
    }



    highlightSegment(event: MouseEvent) {
      if (!this.deleteMode) {
return;
}

      const timelineElement = event.currentTarget as HTMLDivElement;
      const rect = timelineElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const timelineWidth = timelineElement.clientWidth;
      const hoverTime = (offsetX / timelineWidth) * this.videoDuration;

      let start = 0;
      let end = this.videoDuration;

      for (let i = 0; i < this.cutMarkers.length; i++) {
          if (hoverTime < this.cutMarkers[i]) {
              end = this.cutMarkers[i];
              break;
          }
          start = this.cutMarkers[i];
      }

      // Ensure the selected range updates dynamically
      this.selectedDeleteRange = { start, end };
    }


    // When user deletes a section, update the segments list
    selectSegmentToDelete(event: MouseEvent) {
      if (!this.deleteMode || !this.selectedDeleteRange) {
return;
}

      const { start, end } = this.selectedDeleteRange;
      const previousSegments = [...this.segments];  // capture current state

      this.updateSegmentsAfterDelete(start, end);

      const newSegments = [...this.segments];  // new state after deletion

      // Record delete action
      this.recordAction({
        type: 'delete',
        payload: { previousSegments, newSegments }
      });

      this.videoPlayer.nativeElement.currentTime = end;
      this.selectedDeleteRange = null;
      this.deleteMode = false;
    }


    // Update segments when a section is deleted
    updateSegmentsAfterDelete(deleteStart: number, deleteEnd: number) {
      const newSegments: { start: number, end: number }[] = [];

      // For each existing segment, check if it overlaps with the deleted range
      this.segments.forEach(segment => {
        // If segment ends before delete starts or starts after delete ends, keep it as is
        if (segment.end <= deleteStart || segment.start >= deleteEnd) {
          newSegments.push(segment);
        } else {
          // If there's a part before the delete range, keep it
          if (segment.start < deleteStart) {
            newSegments.push({ start: segment.start, end: deleteStart });
          }

          // If there's a part after the delete range, keep it
          if (segment.end > deleteEnd) {
            newSegments.push({ start: deleteEnd, end: segment.end });
          }
        }
      });

      this.segments = newSegments;
      console.log('Updated segments after delete:', this.segments);
    }

    deleteSelectedSection() {
        if (!this.selectedDeleteRange) {
return;
}

        const { start, end } = this.selectedDeleteRange;

        // Adjust video source (this requires reprocessing the video)
        this.videoSource = this.trimVideo(this.videoSource, start, end);

        // Reset selection
        this.selectedDeleteRange = null;
        this.deleteMode = false;
    }

    // Mock function for trimming video (needs backend processing)
    trimVideo(videoSrc: string, start: number, end: number): string {
        console.log(`Would trim video from ${start} to ${end}`);
        return videoSrc; // Placeholder (real implementation needed)
    }

    // Add this getter inside your VideoEditorComponent class
    get deletedSegments(): { start: number; end: number }[] {
      const deleted: { start: number; end: number }[] = [];
      if (this.segments.length === 0) {
          deleted.push({ start: 0, end: this.videoDuration });
          return deleted;
      }

      // Handle first deleted segment before the first kept segment
      if (this.segments[0].start > 0) {
          deleted.push({ start: 0, end: this.segments[0].start });
      }

      // Handle gaps between segments
      for (let i = 0; i < this.segments.length - 1; i++) {
          deleted.push({
              start: this.segments[i].end,
              end: this.segments[i + 1].start
          });
      }

      // Handle last deleted segment after the last kept segment
      const lastSegment = this.segments[this.segments.length - 1];
      if (lastSegment.end < this.videoDuration) {
          deleted.push({ start: lastSegment.end, end: this.videoDuration });
      }

      return deleted;
    }

    // Adds actions to undo stack and clears redo stack
    recordAction(action: EditorAction) {
      this.undoStack.push(action);
      this.redoStack = []; // Clear redo stack on new action
    }

    // Undo action method
    undo() {
      const action = this.undoStack.pop();
      if (!action) {
return;
}

      switch (action.type) {
        case 'cut':
          this.cutMarkers = this.cutMarkers.filter(marker => marker !== action.payload.time);
          break;

        case 'delete':
          this.segments = action.payload.previousSegments;
          break;
      }

      this.redoStack.push(action);
    }

    // Redo action method
    redo() {
      const action = this.redoStack.pop();
      if (!action) {
return;
}

      switch (action.type) {
        case 'cut':
          this.cutMarkers.push(action.payload.time);
          this.cutMarkers.sort((a, b) => a - b);
          break;

        case 'delete':
          this.segments = action.payload.newSegments;
          break;
      }

      this.undoStack.push(action);
    }





    exportEditedVideo() {
      const editData = {
        originalVideo: this.originalVideoSource,
        segments: this.segments,
      };

      console.log('Ready to export with edit data:', editData);

      // Call your backend to process edits
      // this.videoEditorStateService.processEditedVideo(editData).subscribe((response) => {
      //   this.videoSource = response.processedVideoUrl; // backend returns new video URL
      //   this.videoPlayer.nativeElement.load(); // reload the new video
      // });
    }














    // Shows and hides video filters
    toggleFilterControls() {
      this.filterControlsVisible = !this.filterControlsVisible;
    }

    // Applies filters to the video
    applyFilters() {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.style.filter = `
          brightness(${this.filterSettings.brightness})
          contrast(${this.filterSettings.contrast})
          saturate(${this.filterSettings.saturation})
          hue-rotate(${this.filterSettings.hue}deg)
        `;
      }
    }

    // Resets filters to default values
    resetFilters() {
      this.filterSettings = {
        hue: 0,
        brightness: 1,
        contrast: 1,
        saturation: 1
      };
      this.applyFilters();
    }

    // Clears the input field when focused
    clearInput(event: FocusEvent) {
      const inputElement = event.target as HTMLInputElement;
      inputElement.select();
    }

    // Draggable filter menu controls
    startDrag(event: MouseEvent) {
      const filterControls = document.querySelector('.filter-controls') as HTMLElement;

      // Get the initial mouse position and the menu's position
      const offsetX = event.clientX - filterControls.offsetLeft;
      const offsetY = event.clientY - filterControls.offsetTop;

      const onMouseMove = (moveEvent: MouseEvent) => {
        // Calculate the new position of the menu
        const newLeft = moveEvent.clientX - offsetX;
        const newTop = moveEvent.clientY - offsetY;

        // Update the menu's position
        filterControls.style.left = `${newLeft}px`;
        filterControls.style.top = `${newTop}px`;
      };

      const onMouseUp = () => {
        // Remove event listeners when the mouse is released
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      // Add event listeners for dragging
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      // Prevent default behavior to avoid text selection
      event.preventDefault();
    }


    seekForward() {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = Math.min(video.duration, video.currentTime + 5);
    }

    seekBackward() {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = Math.max(0, video.currentTime - 5);
    }


    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case ' ':
          this.togglePlayPause(); // Spacebar Pauses/Plays
          event.preventDefault();
          break;
        case 'm':
          this.toggleMute(); // Hot keys for Mutting
          break;
        case 'c': // Hot keys for Cutting/Trimming
          this.setCut();
          break;
        case 'd':
          this.toggleDeleteMode(); // Hot key to Delete
          break;
        case 'f':
          this.toggleFilterControls(); // Hot keys Saturation,Contrast,Brightness
          case 'ArrowRight':
            this.seekForward();
            break;
          case 'ArrowLeft':
          case 'z':
            if (event.ctrlKey || event.metaKey) { // Hot key for undo
              this.undo();
              event.preventDefault();
            }
            break;
          case 'y':
            if (event.ctrlKey || event.metaKey) { // Hot key for Redo
              this.redo();
              event.preventDefault();
            }
            break;
          case 't':
            this.toggleTranscript();  // Hot key for Transcript
            break;
        }
      }
}
