import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { of} from 'rxjs';
import { compile, parse } from 'ass-compiler';
import { environment } from '../../environments/environment';

@Injectable()
export class ClosedcaptionsService {

  // url = 'http://192.168.1.154:3000';
  // url = 'http://localhost:3000';
  url = environment.serverUrl;
  constructor(private http: HttpClient) { }

  getAss(path:string){
    return this.http.get(path, {responseType:'text'});
  }

  /**
   * Searches for one or more phrases from the database.
   * @param {SearchInformation} searchInformation - the information to send to database.
   * @returns {Observable<any>} - a list of results
   */
  sendSearch(mp4FileName: string, channelId: string, lowerCC: number, upperCC: number) {
    const params: HttpParams = new HttpParams();
    params.set('file_name', mp4FileName);
    params.set('channel_id', channelId);
    params.set('lower_cc_num', lowerCC.toString());
    params.set('upper_cc_num', upperCC.toString());

    return this.http.get(this.url +  '/additionalcc', {params}).pipe(
      map(response => response));
  }

  /**
   * Fetches and parses VTT file to extract the first 5 transcript lines
   * @param ccSource - The URL to the VTT file
   * @returns Observable with the first 5 lines of transcript text
   */
  getVttPreview(ccSource: string): Observable<string> {
    if (!ccSource) {
      return of('Transcript not available');
    }

    return this.http.get(ccSource, { responseType: 'text' }).pipe(
      map(vttContent =>
        // Parse VTT content to extract first 5 text lines
         this.parseVttContent(vttContent)
      ),
      catchError(error => {
        console.error('Error fetching VTT file:', error);
        return of('Transcript could not be loaded');
      })
    );
  }

  /**
   * Parses VTT content and extracts the first 5 lines of actual text
   * @param vttContent - The raw VTT file content
   * @returns String containing the first 5 lines of text
   */
  private parseVttContent(vttContent: string): string {
    if (!vttContent) {
      return 'Transcript not available';
    }

    try {
      // Split the content by lines
      const lines = vttContent.split('\n');

      // Skip header and timestamp lines to find actual text
      const textLines: string[] = [];
      let isTextLine = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines and WEBVTT header
        if (!line || line === 'WEBVTT') {
          continue;
        }

        // Skip timestamp lines (they contain --> )
        if (line.includes('-->')) {
          isTextLine = true;  // Next line should be text
          continue;
        }

        // If this is a text line, add it to our array
        if (isTextLine && !line.match(/^\d+$/) && line) {  // Skip cue numbers
          textLines.push(line);
          // Reset to false since we've captured this text line
          isTextLine = false;

          // Break when we have 5 lines
          if (textLines.length >= 5) {
            break;
          }
        }
      }

      // Join the text lines with spaces
      return textLines.join(' ');
    } catch (e) {
      console.error('Error parsing VTT content:', e);
      return 'Error parsing transcript';
    }
  }
}
