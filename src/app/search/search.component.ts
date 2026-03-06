import { finalize } from 'rxjs/operators';
import { ElementRef, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Component, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Channel } from '../interfaces/channel';
import { SearchInformation } from '../interfaces/search-information';
import { SearchForm } from '../classes/search-form';
import { DownloadForm } from '../classes/download-form';
import { SearchService } from '../services/search.service';
import { ClosedcaptionsService } from '../services/closedcaptions.service';
import { SendEmailService } from '../services/sendemail.service';
// import {CollapseModule} from 'ngx-bootstrap/collapse';
import { RadioStation } from '../interfaces/radioStation';
import { NewspaperTitle } from '../interfaces/newspaperTitle';
import { Country } from '../interfaces/country';
import { StateProvince } from '../interfaces/stateProvince';
import { City } from '../interfaces/city';
import { MagazineTitle } from '../interfaces/magazineTitle';
/** import {path} from "../interfaces/streamVideo";*/
import { compile, /*parse*/ } from 'ass-compiler';
import { ViewEncapsulation } from '@angular/core';
import { Chart, ChartDataset, ChartOptions } from 'chart.js';
type Label = string;
type Color = string | string[];

// import { sendEmail } from "../../../../AWSemail/ses-client";
// import { generateHtml } from '../../../server/services/htmlService';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
// import { clear } from 'mem';
// import { start } from 'repl';

// saving states for video editor
import { VideoEditorStateService } from '../services/video-editor-state.service';

// import { event } from 'cypress/types/jquery';
import { ChangeDetectorRef } from '@angular/core';
import { AdService } from '../services/ad.service';

//for comments
import { getChunks } from '../utils/highlight-string';

// declare let jquery: any;
declare let $: any;

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})

/**
 * Searches for one or more phrases from database.
 */
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  isCollapsed = false;
  showSidebarAd = false;
  showBannerAd = false;
  showFooterAd = false;
  mediaTypeHash = {
    magazine: false,
    newspaper: false,
    radio: false,
    socialMedia: false,
    television: false
  };
  shouldFilter = Object.values(this.mediaTypeHash);// .filter(x => x).length > 0;
  // collapse = false;
  downloadForm: DownloadForm = new DownloadForm();
  searchForm: SearchForm = new SearchForm();
  translatedQuery = '';

  // url = 'http://192.168.1.154:3000';
  // url = 'http://localhost:3000';
  // url = 'http://192.168.0.10:3000';
  url = environment.serverUrl;
  // Newspaper
  newspapers: NewspaperTitle[] = [];
  newspaperResults = [];
  newspaperIds = [];
  newspaperLocations = [];
  allNewsResultsSelected = false;
  npResults = 0;
  npResultsExtra = false;
  isCollapsedPaper = false;

  // Magazine
  magazines: MagazineTitle[] = [];
  magazineResults = [];
  magazineIds = [];
  magazineLocations = [];
  allMagResultsSelected = false;
  mgResults = 0;
  mgResultsExtra = false;
  isCollapsedMag = false;

  // Radio
  radios: RadioStation[] = [];
  radioResults = [];
  radioIds = [];
  radioLocations = [];
  allRadioResultsSelected = false;
  rdResults = 0;
  rdResultsExtra = false;
  isCollapsedRadio = false;

  // Social Media
  socialMediaResults = [];
  socialMediaIds = [];
  socialMediaLocations = [];
  allSocialMediaResultsSelected = false;
  smResults = 0;
  smResultsExtra = false;
  isCollapsedSm = false;

  // TV
  channels: Channel[] = [];
  televisionResults = [];
  tvResultSize = 0;
  televisionIds = [];
  televisionLocations = [];
  allTVResultsSelected = false;
  tvResults = 0;
  tvResultsExtra = false;
  isCollapsedTv = false;
  showDL = false;
  showError = false;
  selectedVideos: any[] = [];
  currentVideoIndex = 0;

  // MISC
  countries: Country[] = [];
  states: StateProvince[] = [];
  cities: City[] = [];
  totalResults = 0;
  limit = 0;
  showResults = false;
  showDetails = false;
  showradio = false;
  radioSegments: number[] = [];
  radioDuration: number;
  videoSegments: number[] = [];
  videoDuration: number;
  mediaType = 'All';
  featuredDetails: object = {};
  showSpinner = false;
  videoSourceBase = this.url+'/stream?file=';
  videoSource = '';
  ccSource = '';
  radioSourceBase = this.url+'/stream?file=';
  radioSource = '';
  resultsReady = false;
  error = null;
  assSource: string;
  assCC: any;
  jsonCC: any;
  simpleCC = [];
  currentTime = 0;
  advanced = false;
  autoScrollEnabled = true;
  showCaptions = false;

  // Video Editor
  @ViewChild('myVid') myVid: any;
  @ViewChild('myClips') myClips: any;
  @ViewChild('resultNav') resultNav!: ElementRef;
  startTimes: Array<any> = [];
  endTimes: Array<any> = [];
  iterateNum: any[] = [];
  numClips = 0;
  @ViewChild('resolution') resolution: any;
  @ViewChild('fileFormat') fileFormat: any;
  resolutionValue = '';
  fileFormatValue = '';
  stitchedVideo = '';
  clipStart = 0;
  clipEnd = 0;

  // Media Analytics
  lineChart: Chart | undefined;
  audience: ChartDataset[] = [
    { data: [17569, 13495, 12100, 9004, 7851, 7541], label: 'Audience' },
  ];
  adValue: ChartDataset[] = [
    { data: [885, 679, 876, 899, 987, 754], label: 'Ad Value' },
  ];
  calAdValue: ChartDataset[] = [
    { data: [4457, 4414, 4056, 3098, 3456, 3678], label: 'Calc Ad Value' },
  ];
  calPublicityValue: ChartDataset[] = [
    { data: [3000, 2875, 3501, 3791, 3895, 2756], label: 'Calc Publicity Value' },
  ];

  lineChartLabels: Label[] = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30'];
  lineChartOptions: ChartOptions = { responsive: true };
  // lineChartColors: Color[] = [
  //   { borderColor: 'black', backgroundColor: 'rgba(255,255,0,0.28)' },
  // ];
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];
  selectedValue = 'audience';


  // Snippet download selection

  // if there are any selected checkboxes for a specific section, then that section will
  // turn to true
  sectionsSelected: object = {
    newspaperChecked : false,
    magazineChecked : false,
    radioChecked : false,
    socialMediaChecked : false,
    tvChecked : false,
  };

  // how many snippets are have been selected
  totalSnippetsChecked = 0;
  downloadButtonText = 'all';

  // information for selecting specific snippets
  toggleAll: object = {
    'newspaper': {
      inputName: 'newsResult',
      htmlId: 'newsCheckAll',
      checked: false,
      allSelected: false,
    },
    'magazine': {
      inputName: 'magResult',
      htmlId: 'magCheckAll',
      checked: false,
      allSelected: false,
    },
    'radio': {
      inputName: 'radResult',
      htmlId: 'radioCheckAll',
      checked: false,
      allSelected: false,
    },
    'socialMedia': {
      inputName: 'socialMediaResult',
      htmlId: 'socialMediaCheckAll',
      checked: false,
      allSelected: false,
    },
    'television': {
      inputName: 'tvResult',
      htmlId: 'tvCheckAll',
      checked: false,
      allSelected: false,
    }
  };

  downloadFormats = [];

  // List of selected media sources
  selectedSources: { id: number; name: string }[] = [];

  // List of bookmarked media sources
  bookmarkedSources: { id: number; name: string }[] = [];

  // Bookmark menu visibility
  bookmarkMenuVisible = false;

  // Active section tracking for nav highlight
  activeSection: string = '';
  private sectionObserver: IntersectionObserver | null = null;
  private sectionIds: string[] = ['newspaperResults', 'magazineResults', 'radioResults', 'tvResults'];

  // Nav scroll-to-fixed state
  isNavFixed = false;
  private navOriginalTop = 0;
  private onScrollBound: any = null;

  // track comment section visiblity
  expandedComments: { [key: string]: boolean } = {};

  // mock comments - TODO: replace with backend API calls
  commentsData: { [key: string]: any[] } = {};

  // Language Translation
  selectedLanguage: string;
  isTranslatePopupOpen = false;
  private pendingTranslateResult: { type: 'newspaper' | 'magazine' | 'radio' | 'tv'; item: any } | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private searchService: SearchService,
    private ccs: ClosedcaptionsService,
    private http: HttpClient,
    private emailService: SendEmailService,
    private authService: AuthService,
    private router: Router,
    private videoEditorStateService: VideoEditorStateService,
    private adService: AdService) {
      this.authService.isVerifiedToAccess();
  }

  ngOnInit(): void {
    // If user is a guest, get their remaining search count
    if (this.authService.isGuestUser()) {
      this.searchService.getGuestSearchCount()
        .subscribe({
          next: (response) => {
            // Guest search count fetched successfully
            console.log('Guest searches remaining:', this.authService.getGuestSearchesLeft());
          },
          error: (error) => {
            // This shouldn't happen with our improved error handling, but just in case
            console.warn('Failed to get guest search count, using default value.', error);
          }
        });
    }


    this.searchService.getChannels().subscribe(
      res => {
        this.channels = res;
      }
    );
    this.searchService.getNewspapers().subscribe(
      res => {
        this.newspapers = res;
      }
    );
    this.searchService.getMagazines().subscribe(
      res => {
        this.magazines = res;
      }
    );
    this.searchService.getRadios().subscribe(
      res => {
        this.radios = res;
      }
    );
    this.searchService.getCountries().subscribe(
      res => {
        this.countries = res;
      }
    );
    this.searchService.getStates().subscribe(
      res => {
        this.states = res;
      }
    );
    this.searchService.getCities().subscribe(
      res => {
        this.cities = res;
      }
    );

    // Initialize ad display based on user authentication status
    this.showSidebarAd = this.adService.showAds(this.authService.isAuthenticated(), this.authService.isGuestUser());
    this.showBannerAd = this.showSidebarAd;
    this.showFooterAd = this.showSidebarAd;

    // Listen for toggle advanced search event from navbar
    window.addEventListener('toggleAdvancedSearch', () => {
      this.toggleAdvanced();
    });

    // Language Translationn Defaults to English
    if (this.selectedLanguage === undefined) {
      this.selectedLanguage = 'English';
      this.searchForm.language = 'English';
    }
  }


  /**
   * Searches using data from search form and displays results.
   */
  search(): void {
    if (this.advanced == true){
      this.advanced = false;
    }

    // Check guest search limit before proceeding
    if (this.authService.isGuestUser() && this.authService.getGuestSearchesLeft() <= 0) {
      this.error = 'You have reached your limit of 5 free searches. Please register for full access.';
      return;
    }

    // Instead of showing an intrusive ad, we'll directly perform the search
    // and display non-intrusive ads alongside the results
    this.performSearch();

    // Update ad visibility based on authentication status
    this.showSidebarAd = this.adService.showAds(this.authService.isAuthenticated(), this.authService.isGuestUser());
    this.showBannerAd = this.showSidebarAd;
    this.showFooterAd = this.showSidebarAd;
  }

  private performSearch(): void {
    // Reset error message and show spinner
    this.error = null;
    this.authService.isVerifiedToAccess();
    if (!this.authService.isAuthenticated()) {
      window.location.reload();
      return;
    }
    // MISC
    this.showResults = true;
    this.showSpinner = true;
    this.resultsReady = false;
    const searchForm = this.getSearchInfo();
    this.totalResults = 0;
    this.limit = 0;

    // Newspaper
    this.newspaperResults = [];
    this.newspaperIds=[];
    this.npResults = 0;
    this.npResultsExtra = false;

    // Magazine
    this.magazineResults = [];
    this.magazineIds=[];
    this.mgResults = 0;
    this.mgResultsExtra = false;

    // Radio
    this.radioResults = [];
    this.radioIds=[];
    this.rdResults = 0;
    this.rdResultsExtra = false;

    // Social Media
    this.socialMediaResults = [];
    this.socialMediaIds=[];
    this.smResults = 0;
    this.smResultsExtra = false;

    // TV
    this.televisionResults = [];
    this.televisionIds=[];
    this.tvResults = 0;
    this.tvResultsExtra = false;

    //TODO Add transalte into language here?? IDK

    this.searchService.sendSearch(searchForm).pipe(
      finalize(() => {
        this.showSpinner = false;
      }))
      .subscribe(response => {
        // console.log('response: ' + JSON.stringify(response));
        this.totalResults = (response.newsResults?.length ?? 0)
         + (response.magResults?.length ?? 0)
          + (response.socialMediaResults?.length ?? 0)
           + (response.radioResults?.length ?? 0)
            + (response.tvResultsSize);
        console.log(this.totalResults);

        // Get the results
        // this.translatedQuery = response.translatedQuery; //TODO use for lang translation
        this.newspaperResults = response.newsResults;
        this.magazineResults = response.magResults;
        this.radioResults = response.radioResults;
        this.televisionResults = response.results;
        this.tvResultSize = response.tvResultsSize;
        // for (let hithere of JSON.parse(response.resultsSocial.socialMediaResults)) {
        //   console.log(hithere);
        //   this.socialMediaResults.push(hithere);
        // }

        // Display the results
        this.displayResults();
        this.displayNewspaperResults();
        this.displayMagazineResults();
        this.displayRadioResults();
        // this.displaySocialMediaResults(); //THIS IS NEW

        // Create an ID for each of the results
        this.createIDList(this.radioResults, this.radioIds);
        this.createIDList(this.newspaperResults, this.newspaperIds);
        this.createIDList(this.magazineResults, this.magazineIds);
        // the other categories use 'ID' as the key name, socialMedia uses 'id'
        // this.createIDList(this.socialMediaResults, this.socialMediaIds, "id");
        this.createIDListTV(this.televisionResults, this.televisionIds);

        this.limit = searchForm.numOfRecords - 1;
        this.error = response.RrowsByFilenameErr || response.newsResultsError || response.magResultsError || response.radioResultsError;
        this.resultsReady = true;
        // Initialize observer to track which section is visible so we can highlight nav
        setTimeout(() => {
          this.initSectionObserver();
          this.setupNavWatcher();
        }, 50);


      }, err => {
        console.log(err);
        this.error = err.toString();
	});
     this.authService.isVerifiedToAccess();
     if (!this.authService.isAuthenticated()) {
     	window.location.reload();
	return;
     }
  }

  /**
   * toggle the advanced search/results feature
   */
  toggleAdvanced(){
 this.advanced = !this.advanced;
}




  /**
   * Updates the locational dropdowns upon selection of a country, state/providence, or city.
   * @param dropdown - the dropdown that is modified
   */
  updateLocationalDropdowns(dropdown: string): void {
    if (dropdown === 'country') {
      if (this.searchForm.country == 'All') { // get all options
        this.searchService.getCountries().subscribe(
          res => {
            this.countries = res;
          }
        );
        this.searchService.getStates().subscribe(
          res => {
            this.states = res;
          }
        );
        this.searchService.getCities().subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.stateProv = 'All';
        this.searchForm.city = 'All';
      } else { // selection made
        // update state and city dropdowns
        this.searchService.updateLocations(dropdown, this.searchForm.country, 'state').subscribe(
          res => {
            this.states = res;
          }
        );
        this.searchService.updateLocations(dropdown, this.searchForm.country, 'city').subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.stateProv = 'All';
        this.searchForm.city = 'All';
      }
    } else if (dropdown === 'state') {
      // update country and city dropdowns
      if (this.searchForm.country == 'All' && this.searchForm.stateProv == 'All') { // get all options
        this.searchService.getCountries().subscribe(
          res => {
            this.countries = res;
          }
        );
        this.searchService.getStates().subscribe(
          res => {
            this.states = res;
          }
        );
        this.searchService.getCities().subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.city = 'All';
      } else if (this.searchForm.country == 'All' && this.searchForm.stateProv != 'All') {
        // update country if previously unselected
        this.searchService.updateLocations(dropdown, this.searchForm.stateProv, 'country').subscribe(
          res => {
            this.countries = res;
          }
        );
        this.searchService.updateLocations(dropdown, this.searchForm.stateProv, 'city').subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.city = 'All';
      } else if (this.searchForm.stateProv == 'All') { // replace the state and city based on the country
        this.searchService.updateLocations('country', this.searchForm.country, 'state').subscribe(
          res => {
            this.states = res;
          }
        );
        this.searchService.updateLocations('country', this.searchForm.country, 'city').subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.city = 'All';
      } else { // just update the city
        this.searchService.updateLocations(dropdown, this.searchForm.stateProv, 'city').subscribe(
          res => {
            this.cities = res;
          }
        );
        this.searchForm.city = 'All';
      }
    } else if (dropdown === 'city') {
      // update country and state dropdowns
      if (this.searchForm.country == 'All' && this.searchForm.stateProv == 'All'
        && this.searchForm.city == 'All') { // get all countries + states
        this.searchService.getCountries().subscribe(
          res => {
            this.countries = res;
          }
        );
        this.searchService.getStates().subscribe(
          res => {
            this.states = res;
          }
        );
      } else if (this.searchForm.country != 'All' && this.searchForm.stateProv == 'All'
        && this.searchForm.city == 'All') { // get all of the states in country
        this.searchService.updateLocations('country', this.searchForm.country, 'state').subscribe(
          res => {
            this.states = res;
          }
        );
      } else { // just update the country and state
        if (this.searchForm.country == 'All') { // update if previously unselected
          this.searchService.updateLocations(dropdown, this.searchForm.city, 'country').subscribe(
            res => {
              this.countries = res;
            }
          );
        }
        if (this.searchForm.stateProv == 'All') { // update if previously unselected
          this.searchService.updateLocations(dropdown, this.searchForm.city, 'state').subscribe(
            res => {
              this.states = res;
            }
          );
        }
      }
    }
  }
  /**
   * Updates the radio station dropdowns upon selection of a country, state/providence, or city.
   */
  updateRadioDropdown(){
    const country = this.searchForm.country;
    const state = this.searchForm.stateProv;
    const city = this.searchForm.city;

    this.searchService.updateRadio(country, state, city).subscribe(
      res => {
        this.radios = res;
      }
    );
  }

  /**
   * Updates the newspaper dropdowns upon selection of a country, state/providence, or city.
   */
  updateNewspaperDropdown() {
    const country = this.searchForm.country;
    const state = this.searchForm.stateProv;
    const city = this.searchForm.city;

    this.searchService.updateNewspapers(country, state, city).subscribe(
      res => {
        this.newspapers = res;
      }
    );
  }

  /**
   * Updates the magazine dropdowns upon selection of a country, state/providence, or city.
   */
  updateMagazineDropdown(){
    const country = this.searchForm.country;
    const state = this.searchForm.stateProv;
    const city = this.searchForm.city;

    this.searchService.updateMagazines(country, state, city).subscribe(
      res => {
        this.magazines = res;
      }
    );
  }


 // Language Transaltion 
 onLanguageChanged(lang: string) {
  this.selectedLanguage = lang;
  this.searchForm.language = lang;
}

 openTranslatePopup(type: 'newspaper' | 'magazine' | 'radio' | 'tv', item: any): void {
  this.pendingTranslateResult = { type, item };
  this.isTranslatePopupOpen = true;
 }

 closeTranslatePopup(): void {
  this.isTranslatePopupOpen = false;
  this.pendingTranslateResult = null;
 }

 onTranslatePopupLanguageSelected(lang: string): void {
  this.onLanguageChanged(lang);
  if (this.showResults) {
    this.performSearch();
  }
  this.closeTranslatePopup();
 }

  /**
   * Sets up an email alert using the information in the current search form.
   */
  // submitAlertSetup(): void {
  //   const searchForm = this.getSearchInfo();
  //   if (this.validAlertSubmission()) {
  //     this.emailService.sendEmail(searchForm)
  //       .subscribe(response => {
  //         $("#setupConfirmationModal").modal();
  //       });
  //   } else {
  //     $("#invalidSetupModal").modal();
  //   }
  // }

  /**
   * Checks if there's enough information to set up an alert
   */
  validAlertSubmission(): boolean {
    const searchForm = this.getSearchInfo();
    console.log(searchForm.searchQuery);
    return searchForm.emailAddresses !== ''
      && searchForm.searchQuery.trim().length > 0
      && searchForm.searchQuery !== '+\"\" '
      && searchForm.realTimeAlerts !== '';
  }

  /**
   * Displays TV results from response from server.
   * @param response - the server response containing all search results
   */
  displayResults(): void {
    const tempTVResults = [];
    console.log('Raw TV Results:', this.televisionResults);
    for (const key in this.televisionResults) {
        for (const i in this.televisionResults[key]) {
            const item = this.televisionResults[key][i];

            // Ensure that Mp4_File_Name is defined before proceeding
            if (!item.Mp4_File_Name) {
                console.warn(`Missing Mp4_File_Name for item at ${key}[${i}]`);
                continue; // Skip this iteration if no Mp4_File_Name
            }

            // Assign video and subtitle sources before clicking
            item.videoSource = this.videoSourceBase + item.Mp4_File_Name;
            item.ccSource = this.videoSourceBase + item.Mp4_File_Name.replace('.mp4', '.vtt');

            // Get the current search query for highlighting
            const searchQuery = this.searchForm.keywords_string;

            // Store the search term for later highlighting
            item.searchTerm = searchQuery;

            // Set a default display text
            item.Display_Text = 'Loading transcript snippet...';

            // Get video duration
            this.getVideoDuration(item.videoSource, item);

            // Use the ccSource to fetch the first 5 lines of the transcript
            this.ccs.getVttPreview(item.ccSource).subscribe(vttPreview => {
                if (vttPreview) {
                    // Apply highlighting to the preview
                    const highlightedPreview = this.highlightWords(vttPreview);

                    // Update both Display_Text and Result_Line with the transcript preview
                    item.Display_Text = highlightedPreview;
                    item.Result_Line = highlightedPreview;

                    console.log(`Successfully loaded transcript preview for ${item.Mp4_File_Name}`);
                }
            }, error => {
                console.error(`Error fetching VTT preview for ${item.Mp4_File_Name}:`, error);

                // Fallback to the original method if VTT preview fails
                this.ccs.sendSearch(
                    item.Mp4_File_Name,
                    item.Channel_Id,
                    item.CC_Num - 5,  // Get 5 lines before
                    item.CC_Num + 5   // Get 5 lines after
                ).subscribe(res => {
                    if (res && res['additional_cc']) {
                        // Store the transcript snippet with highlighting
                        const snippet = this.highlightWords(res['additional_cc']);

                        // Update the display text with the fetched transcript
                        item.Display_Text = snippet;

                        // Also update the Result_Line for consistency
                        item.Result_Line = snippet;
                    } else {
                        // Fallback if we couldn't get a transcript
                        item.Display_Text = 'Transcript unavailable. Click to view video.';
                    }
                }, error => {
                    console.error('Error fetching transcript for', item.Mp4_File_Name, error);
                    item.Display_Text = 'Error loading transcript. Click to view video.';
                });
            });

            // Debug log
            console.log(`SEARCH RESULT #${i} for file ${key}:`, {
                videoSource: item.videoSource,
                ccSource: item.ccSource,
                matchSnippet: item.Match_Snippet,
                displayText: item.Display_Text,
                fullTranscript: item.Result_Line ? item.Result_Line.substring(0, 100) + '...' : 'N/A'
            });

            // Print a more focused view of just the matched text for debugging
            console.log(`MATCHED TEXT #${i}: "${item.Match_Snippet || 'No match snippet available'}"`);
            if (item.Match_Snippet && item.Match_Snippet.includes('**')) {
                const matchedTerm = item.Match_Snippet.match(/\*\*(.*?)\*\*/);
                if (matchedTerm && matchedTerm[1]) {
                    console.log(`EXACT MATCH #${i}: "${matchedTerm[1]}"`);
                }
            }
        }
        tempTVResults.push({ location: key, data: this.televisionResults[key] });
    }

    this.televisionResults = tempTVResults;
    this.televisionLocations = [];
    this.televisionIds = [];

    if (this.televisionResults.length > Number(this.searchForm.numOfResults)) {
        this.tvResultsExtra = true;
    } else {
        this.tvResultsExtra = false;
    }

    while (this.televisionResults.length > Number(this.searchForm.numOfResults)) {
        this.televisionResults.pop();
    }

    this.tvResults = this.televisionResults.length;
}

/**
 * capturing thumbnails for the TV results
 */
captureThumbnail(video: HTMLVideoElement, item: any) {
  item.thumbnailLoaded = false; // Show the GIF initially

  // Ensure video is loaded
  video.onloadeddata = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      item.thumbnail = canvas.toDataURL('image/jpeg'); // Convert frame to image URL
    } catch (error) {
      console.error('Thumbnail extraction failed ', error);
      item.thumbnail = 'assets/images/video-placeholder.png'; // Fallback image
    }
    item.thumbnailLoaded = true; // Hide the loading GIF
  };
}
/**
 * capturing Tv results video duration
 */
getVideoDuration(videoUrl: string, item: any) {
  const video = document.createElement('video');
  video.src = videoUrl;
  video.preload = 'metadata'; // Load metadata only
  video.onloadedmetadata = () => {
      item.duration = this.formatDuration(video.duration);
  };
  video.onerror = () => {
      console.error('Error loading video for duration:', videoUrl);
      item.duration = 'N/A'; // Handle error case
  };
}

formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`; // Format as MM:SS
}


getDaysSinceUpload(uploadDate: string): number {
  if (!uploadDate) {
return 0;
} // Handle missing dates
  const uploadTime = new Date(uploadDate).getTime();
  const currentTime = new Date().getTime();
  const diffInDays = Math.floor((currentTime - uploadTime) / (1000 * 60 * 60 * 24));
  return diffInDays;
}


handleImageError(event: any) {
  console.error('Error loading thumbnail, using default image.', event);
  event.target.src = 'assets/images/video-arrow.png'; // Fallback image
}



  /**
   * Displays newspaper results from response from server.
   */
  displayNewspaperResults(): void {
    if (this.newspaperResults.length > Number(this.searchForm.numOfResults)) {
      this.npResultsExtra = true;
    } else {
      this.npResultsExtra = false;
    }
    while (this.newspaperResults.length > Number(this.searchForm.numOfResults)) {
      this.newspaperResults.pop();
    }
    this.npResults = this.newspaperResults.length;
    for (const key in this.newspaperResults) {
      this.newspaperResults[key].Title = this.highlightWords(this.newspaperResults[key].Title);
      if (this.newspaperResults[key].Summary !== null) {
        this.newspaperResults[key].Summary = this.highlightWords(this.newspaperResults[key].Summary);
      }
    }
    this.newspaperLocations = []; // clears list of all checked locations and id list
    this.newspaperIds = [];
  }

  /**
   * Displays magazine results from response from server.
   */
  displayMagazineResults(): void {
    if (this.magazineResults.length > Number(this.searchForm.numOfResults)) {
      this.mgResultsExtra = true;
    } else {
      this.mgResultsExtra = false;
    }
    while (this.magazineResults.length > Number(this.searchForm.numOfResults)) {
      this.magazineResults.pop();
    }
    this.mgResults = this.magazineResults.length;
    for (const key in this.magazineResults) {
      this.magazineResults[key].Title = this.highlightWords(this.magazineResults[key].Title);
      if (this.magazineResults[key].Summary !== null) {
        this.magazineResults[key].Summary = this.highlightWords(this.magazineResults[key].Summary);
      }
    }
    this.magazineLocations = []; // clears list of all checked locations and id list
    this.magazineIds = [];
  }

  /**
   * Smooth-scroll to a section on the search results page.
   * Position the section header so it appears right below the fixed nav buttons.
   * Uses the fixed nav's position (top: 113px) as reference for consistent spacing.
   * @param sectionId - id of the target container (e.g. 'newspaperResults')
   */
  scrollTo(sectionId: string): void {
    try {
      const el = document.getElementById(sectionId);
      if (el) {
        // Add a small delay to ensure layout is settled before calculating position
        setTimeout(() => {
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          
          // The fixed nav sits at top: 113px and has ~50px visual height + margins
          // So total space from top is about 113px + 50px + 30px gap = 193px
          // Scroll to position header just below that
          const FIXED_NAV_TOP = 113;      // CSS: top: 113px when fixed
          const NAV_HEIGHT = 50;          // Approximate visual height
          const GAP = 30;                 // Gap below nav (increased from 10px)
          const totalOffset = FIXED_NAV_TOP + NAV_HEIGHT + GAP;
          
          const offsetPosition = elementPosition - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 10);
        return;
      }
      // Fallback: try querying within the component element
      const node = this.elementRef && this.elementRef.nativeElement ? this.elementRef.nativeElement.querySelector('#' + sectionId) : null;
      if (node) {
        setTimeout(() => {
          const elementPosition = node.getBoundingClientRect().top + window.pageYOffset;
          const FIXED_NAV_TOP = 113;
          const NAV_HEIGHT = 50;
          const GAP = 30;
          const totalOffset = FIXED_NAV_TOP + NAV_HEIGHT + GAP;
          
          const offsetPosition = elementPosition - totalOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 10);
      }
    } catch (err) {
      console.warn('scrollTo failed for', sectionId, err);
    }
  }

  /**
   * Initialize an IntersectionObserver to update `activeSection` as the user scrolls.
   */
  initSectionObserver(): void {
    // Disconnect previous observer if present
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.sectionObserver = null;
    }

    // Create a new observer
    try {
      this.sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            this.activeSection = id;
          }
        });
      }, { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 });

      // Observe available section elements
      this.sectionIds.forEach(sid => {
        const el = document.getElementById(sid);
        if (el) {
          this.sectionObserver!.observe(el);
        }
      });
    } catch (err) {
      console.warn('IntersectionObserver unavailable or failed to initialize', err);
    }
  }

  ngOnDestroy(): void {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.sectionObserver = null;
    }
    // Remove scroll listener for nav if attached
    try {
      if (this.onScrollBound) {
        window.removeEventListener('scroll', this.onScrollBound as EventListenerOrEventListenerObject);
        this.onScrollBound = null;
      }
    } catch (err) {
      // ignore removal errors
    }
  }

  ngAfterViewInit(): void {
    // Nav watcher is initialized after results are rendered; nothing needed here.
  }

  /**
   * Setup watcher to toggle `.fixed` class on the nav when scrolled past its original position.
   * The nav will stick to the bottom of the navbar (top: 56px).
   */
  setupNavWatcher(): void {
    // If the nav element isn't present yet, wait a bit and retry
    if (!this.resultNav || !this.resultNav.nativeElement) {
      setTimeout(() => this.setupNavWatcher(), 100);
      return;
    }

    // Compute the original top position of the nav in the document
    const rect = this.resultNav.nativeElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    this.navOriginalTop = scrollTop + rect.top;

    // Calculate the scroll position at which the nav should become fixed
    // The nav should stick when it reaches 113px from the top of the viewport
    const STICKY_TOP_POSITION = 113;
    const navStickThreshold = this.navOriginalTop - STICKY_TOP_POSITION;

    // Bind and attach scroll handler
    this.onScrollBound = () => {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || 0;
      const shouldBeFixed = scrollPos >= navStickThreshold;
      if (shouldBeFixed !== this.isNavFixed) {
        this.isNavFixed = shouldBeFixed;
        // trigger change detection since this can be called outside Angular zone
        try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
      }
    };

    window.addEventListener('scroll', this.onScrollBound as EventListenerOrEventListenerObject, { passive: true });
    // run once to set initial state
    (this.onScrollBound as Function)();
  }

  /**
   * Displays social media results from response from server.
   */
  displaySocialMediaResults(): void {
    console.log('SOCIAL MEDIA LENGTH:' + this.socialMediaResults.length);
    if (this.socialMediaResults.length > Number(this.searchForm.numOfResults)) {
      this.smResultsExtra = true;
    } else {
      this.smResultsExtra = false;
    }
    while (this.socialMediaResults.length > Number(this.searchForm.numOfResults)) {
      this.socialMediaResults.pop();
    }
    this.smResults = this.socialMediaResults.length;
    for (const key in this.socialMediaResults) {
      this.socialMediaResults[key].text = this.highlightWords(this.socialMediaResults[key].text);
    }
    this.socialMediaLocations = [];
    this.socialMediaIds = [];
    if (this.socialMediaResults.length > Number(this.searchForm.numOfResults)) {
      this.smResultsExtra = true;
    } else {
      this.smResultsExtra = false;
    }
    while (this.socialMediaResults.length > Number(this.searchForm.numOfResults)) {
      this.socialMediaResults.pop();
    }
    this.smResults = this.socialMediaResults.length;
  }

  /**
   * Prepares form for new search.
   */
  newSearch(): void {
    this.isCollapsedPaper = false;
    this.isCollapsedMag = false;
    this.isCollapsedRadio = false;
    this.isCollapsedSm = false;
    this.isCollapsedTv = false;
    this.showResults = false;
    this.searchForm = new SearchForm();
  }

  /**
   * Highlights search phrases within the given text.
   * @param text - the text to highlight phrases in
   * @returns {string} - text with HTML classes that highlight selected phrases
   */
  highlightWords(text: string): string {
    // First change the keywords to now be a string with words separated with | per reg exp
    // console.log("translatedQuery: " + this.translatedQuery);
    console.log('keywords_string: ' + this.searchForm.keywords_string);
    let keywords = this.searchForm.keywords_string.split(',').join('|');
    // console.log("search.component.ts hilight: ", keywords);	//Debug
    if((keywords.length > 0) && (this.searchForm.or_search_string.length > 0)) {
keywords += '|';
}
    keywords += this.searchForm.or_search_string.split(',').join('|');
    // console.log("search.component.ts hilight: ", keywords);	//Debug
    // The browser text contains random extra spaces that aren't even visible!
    text = text.replace(/\s+/g,' ').trim();		// get rid of extra spaces
    // For every match found replace with a highlighted version
    return text.replace(new RegExp(keywords, 'gi'), (x) => '<span class="found-text-highlight">' + x   + '</span>');
  }


  /**
   Video Editing Functions
   */

   getFormattedDate(dateString: string): string {
    const utcDate = new Date(dateString);
    const formattedDate = formatDate(utcDate, 'MMM d, y @ h:mm a', 'en-US');
    return formattedDate;
  }

  /**
   * Function to allow the user to set the start times of the clips
   */
  setStartTime(): void {
    const player = document.getElementsByTagName('video')[0];
    for(let i = 0; i < this.numClips; i++){
      if(this.startTimes[i] === ''){
        this.startTimes[i] = player.currentTime;
        break;
      }
    }
  }

  /**
   * Function to allow the user to set the end times of the clips
   */
  setEndTime(): void {
    const player = document.getElementsByTagName('video')[0];

    for(let i = 0; i < this.numClips; i++){
      if(this.endTimes[i] === ''){
        this.endTimes[i] = player.currentTime;
        break;
      }
    }
  }

  /**
   * Function to allow the user to set the number of clips they want to make
   */
  setNumClips(): void{
    this.numClips = Number(this.myClips.nativeElement.value);
    this.iterateNum = Array(this.numClips).fill(0).map((x,i)=>i);
    this.reset();
    // for (let i = 0; i < this.numClips; i++) {
    //   this.startTimes.push('')
    //   this.endTimes.push('')
    // }
    console.log(this.iterateNum, this.startTimes, this.endTimes);
  }
  /**
   * Function to allow the user to set the resolution of the clips
   */
  setResolution(): void{
    this.resolutionValue = String(this.resolution.nativeElement.value);
    console.log(this.resolutionValue);
  }

  /**
   * Function to allow the user to set the file format of the clips
   */
  setFileFormat(): void{
    this.fileFormatValue = String(this.fileFormat.nativeElement.value);
    console.log(this.fileFormatValue);
  }

  /**
   * Function to allow the user to reset the start and end times
   */
  reset(){
    this.startTimes = [];
    this.endTimes = [];
    for (let i = 0; i < this.numClips; i++) {
      this.startTimes.push('');
      this.endTimes.push('');
    }
  }

  /**
   * Function to allow the user to change the start time of a clip
   */
  changeStart(idx, event: Event): void{
    this.startTimes[idx] = (event.target as HTMLInputElement).value;
    console.log(event, idx, this.startTimes);
  }

  /**
   * Function to allow the user to change the end time of a clip
   */
  changeEnd(idx, event): void{
    this.endTimes[idx] = (event.target as HTMLInputElement).value;
    console.log(this.endTimes[idx]);
  }

  /* Calls the endpoint that does the trimming/stitching of the clips.
     Takes in start and end time arrays, resolution, and fileFormat.
  */
  async videoEditor(): Promise<void> {
    this.stitchedVideo = this.url + '/videoEditor?file=' + this.featuredDetails['Mp4_File_Name'] + '&' + new URLSearchParams({
      start: this.startTimes.toString(),
      end: this.endTimes.toString(),
      resolution: this.resolutionValue.toString(),
      fileFormat: this.fileFormatValue.toString()
    });
    this.ccSource = '';
    const _self=this;
    // var player = document.getElementsByTagName('video')[0];
    // var player = document.getElementById('trimmedvideoPlayer') as HTMLVideoElement;
    // player.load();
    // ahmed code start
    setTimeout(() => {
      const player = document.getElementsByTagName('video')[0];

      if (player) {
          console.log('✅ Video player found. Loading video...');
          player.load();
      } else {
          console.warn('⚠️ Video player not found. Trying to re-render...');

          // Force a UI refresh if necessary
          this.videoSource = this.videoSource;
          setTimeout(() => {
              const retryPlayer = document.getElementsByTagName('video')[0];
              if (retryPlayer) {
                  retryPlayer.load();
              } else {
                  console.error('❌ Error: Video player still not found.');
              }
          }, 500);
      }
  }, 500);// 500ms delay to ensure the DOM updates
    // ahmed code ends
    // player.onloadeddata = function() { _self.createVideoSegments() }
  }


  /* Event Listeners for highlighting clips. Mouse down will get the start point and mouse up will get the end point. */
  mouseUp = (event: Event): void => {
    const selected = event.target as HTMLElement;
    const res = selected.id.replace(/\D/g, '');
    this.clipEnd = this.simpleCC[res].end;

  };

  mouseDown = (event: Event): void  => {
    const selected = event.target as HTMLElement;
    const res = selected.id.replace(/\D/g, '');
    this.clipStart = this.simpleCC[res].start;
  };

  /* Function to set the start and end time of the highlighted portion.
     If statement for edge case of highlighting backwards where the end time is less than the start time.
     Right now if the user highlights backwards making the endtime less than the start time, it will output into the console.
     Next team just needs to add an error message if they would like indicating that you can't clip backwards.
  */

  highlightSetClip(){
    if(this.clipEnd < this.clipStart){
      console.log('Cant');
    } else{
      for(var i = 0; i < this.numClips; i++){
        console.log('ENDT', this.endTimes);
        if(this.endTimes[i] === ''){
          this.endTimes[i] = this.clipEnd;
          break;
        }
      }
      for(var i = 0; i < this.numClips; i++){
        if(this.startTimes[i] === ''){
          this.startTimes[i] = this.clipStart;
          break;
        }
      }
    }
  }

  /* Toggles highlighting of the text.
     We remove the closed-captions class as that is what does the auto highlighting.
     Font and style of the text changes though,
     so the next team will just need to add a class in place of the closed-captions class to keep the styling, but take away the auto highlighting.
  */
  toggleHighlight():void{
    const _self = this;
    console.log('SLEF', _self);
    const captionDiv = document.getElementById('closedCaptions');
    if(captionDiv.classList.contains('closed-captions')){
      captionDiv.classList.remove('closed-captions');
      document.getElementById('toggleHighlight').innerHTML = 'Enable Auto Highlight';
      document.getElementById('highlightSetClip').hidden = false;
      document.querySelectorAll('.cc-text').forEach((element) => {
        element.addEventListener('mouseup', _self.mouseUp, false);
        element.addEventListener('mousedown', _self.mouseDown, false);
      });

    } else{
      captionDiv.classList.add('closed-captions');
      document.getElementById('highlightSetClip').hidden = true;
      document.getElementById('toggleHighlight').innerHTML = 'Disable Auto Highlight';
      document.querySelectorAll('.cc-text').forEach((element) => {
        element.removeEventListener('mouseup', _self.mouseUp, false);
        element.removeEventListener('mousedown', _self.mouseDown, false);
      });
    }
  }

  // Toggles auto scroll option for button
  toggleAutoScroll(): void {
    this.autoScrollEnabled = !this.autoScrollEnabled;

    const scrollButton = document.getElementById('toggleAutoScroll');
    if (scrollButton) {
      scrollButton.innerHTML = this.autoScrollEnabled ? 'Disable Auto Scroll' : 'Enable Auto Scroll';
    }
  }

  // Search transcript for keywords
  searchTranscript(query: string): void {
    const allElements = document.querySelectorAll('.cc-text');
    let q = query.trim();

    const normalizeQuotes = (text: string) =>
      text.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, '\''); // Normalize smart apostrophes to '

    q = normalizeQuotes(q);
    const safeQuery = this.escapeRegExp(q);
    const regex = new RegExp(`(${safeQuery})`, 'gi');

    allElements.forEach(el => {
      const originalText = el.getAttribute('data-original-text') || el.textContent || '';
      const normalizedText = normalizeQuotes(originalText);

      if (!el.getAttribute('data-original-text')) {
        el.setAttribute('data-original-text', originalText);
      }

      if (q.length > 0) {
        const highlighted = normalizedText.replace(regex, '<span class="search-highlight">$1</span>');
        el.innerHTML = highlighted;
      } else {
        el.innerHTML = originalText;
      }
    });

    const firstMatch = document.querySelector('.cc-text .search-highlight');
    const captionBox = document.getElementById('caption-box');
    if (firstMatch && captionBox) {
      captionBox.scrollTo({
        top: (firstMatch as HTMLElement).offsetTop - captionBox.clientHeight / 2,
        behavior: 'smooth'
      });
    }
  }

  escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Switches search view to Details page of featured result.
   * @param detailsObj - object containing details for result to be featured
   */
  goToDetails(detailsObj: any, i?: number): void {
    this.currentVideoIndex = i !== undefined ? i : 0;

    console.log('goToDetails() triggered. Current Index:', this.currentVideoIndex);
    console.log('Navigating to:', detailsObj);

    if (!detailsObj || !detailsObj.Mp4_File_Name) {
        console.error('Invalid video details. Cannot navigate.');
        return;
    }

    // Clear and Reset Video Element
    setTimeout(() => {
        const videoElement = document.getElementById('videoPlayer') as HTMLVideoElement;
        if (videoElement) {
            videoElement.pause();
            videoElement.src = ''; // Clear source
            videoElement.load();
        }

        // Update Video Source
        this.featuredDetails = { ...detailsObj };
        this.videoSource = this.videoSourceBase + detailsObj.Mp4_File_Name;
        this.ccSource = this.videoSourceBase + detailsObj.Mp4_File_Name.replace('.mp4', '.vtt');
        this.assSource = this.videoSourceBase + detailsObj.Mp4_File_Name.replace('.mp4', '.ass');

        console.log('Video source updated:', this.videoSource);

        this.showDetails = true; // Show UI again after re-render
        this.cdr.detectChanges();

        // Reload Video After UI Updates
        setTimeout(() => {
            if (videoElement) {
                videoElement.src = this.videoSource;
                videoElement.load();
            }
        }, 200);
    }, 50);
  }

  videoChecked(video: any, event: Event) {
    console.log('Checkbox clicked:', video);

    if ((event.target as HTMLInputElement).checked) {
        if (!this.selectedVideos.some(v => v.Mp4_File_Name === video.Mp4_File_Name)) {
            this.selectedVideos.push(video);
            console.log('Added to selectedVideos:', video);
        }
    } else {
        this.selectedVideos = this.selectedVideos.filter(v => v.Mp4_File_Name !== video.Mp4_File_Name);
        console.log('Removed from selectedVideos:', video);
    }

    console.log('Updated selectedVideos:', this.selectedVideos);

    // Force UI update
    this.selectedVideos = [...this.selectedVideos];
  }

  editSelectedVideos() {
    console.log('Edit Selected Clicked! Selected videos:', this.selectedVideos);

    if (this.selectedVideos.length > 0) {
        console.log('Navigating to the first selected video');
        this.currentVideoIndex = 0;
        console.log('First video details:', this.selectedVideos[0]);

        this.goToDetails(this.selectedVideos[this.currentVideoIndex], this.currentVideoIndex);
    } else {
        console.warn('No videos selected! Cannot proceed.');
    }
  }

  nextVideo(): void {
    console.log('Current Index Before Increment:', this.currentVideoIndex);

    if (this.currentVideoIndex < this.selectedVideos.length - 1) {
        this.currentVideoIndex++;
        console.log('Moving to next video. Current Index:', this.currentVideoIndex);

        if (!this.selectedVideos[this.currentVideoIndex]) {
            console.error('ERROR: selectedVideos[' + this.currentVideoIndex + '] is undefined!');
            return;
        }

        console.log('Next video details:', this.selectedVideos[this.currentVideoIndex]);

        this.goToDetails(this.selectedVideos[this.currentVideoIndex], this.currentVideoIndex);
    } else {
        console.warn('No more videos available.');
    }
  }

  previousVideo(): void {
    console.log('Current Index Before Decrement:', this.currentVideoIndex);

    if (this.currentVideoIndex > 0) {
        this.currentVideoIndex--;
        console.log('Moving to previous video. Current Index:', this.currentVideoIndex);

        if (!this.selectedVideos[this.currentVideoIndex]) {
            console.error('ERROR: selectedVideos[' + this.currentVideoIndex + '] is undefined!');
            return;
        }

        console.log('Previous video details:', this.selectedVideos[this.currentVideoIndex]);

        this.goToDetails(this.selectedVideos[this.currentVideoIndex], this.currentVideoIndex);
    } else {
        console.warn('Already at the first video.');
    }
  }

  goToVideoEditor(): void {
    console.log('Navigating to video editor...');

    this.videoEditorStateService.videoSource = this.videoSource;
    this.videoEditorStateService.ccSource = this.ccSource;
    this.videoEditorStateService.featuredDetails = this.featuredDetails;

    this.router.navigate(['/video-editor']);
}


  detailsWrapper(i: number): void {
    this.goToDetails(this.televisionResults[i].data[0], i);
  }

// nextVid(numResults, i): void {

// }

  /**
   * Create a video segment every 2 minutes
   */
  createVideoSegments(): void {
    this.doCC();
    $('.caption-box').show();
    const player = document.getElementsByTagName('video')[0];
    this.videoDuration = player.duration;
    for(let i = 120; i < this.videoDuration; i = i + 120) {
      this.videoSegments.push(i);
    }

  }

  /**
   * Set initial video start time
   */
  videoSegmentDetail(startTime: number, i: number) {
    const player = document.getElementsByTagName('video')[i + 1];
    // if (player.currentTime != startTime)
    player.currentTime = startTime;
    // console.log("start time: " + startTime + ", i: " + i);
  }



  doCC(){
    this.jsonCC=compile(this.assCC);

    // console.log(this.assCC)
    // console.log(this.jsonCC)
    const _self=this;

    this.jsonCC.dialogues.forEach((element,i)=>{
      this.simpleCC.push({
        id: i,
        start: element.start,
        end: element.end,
        text: element.slices[0].fragments[0].text
          .replace(/\\N/g, '\n')   // converting \N to line breaks
          .replace(/\\h/g, '')     // removes all \h instances
      });
    });
    this.simpleCC.forEach(el=>{
      $('.closed-captions').append('<span class=\'cc-text\' id=\'cc-text-'+el.id+'\'>'+el.text+'&nbsp;&nbsp;</span>');
      $('#cc-text-'+el.id).on('click',() =>{
_self.goToVideoSegment(el.start);
});
    });
    // console.log(this.simpleCC)
    setInterval(() =>{
_self.updateCurrentCCLocation();
},1000);
  }

  updateCurrentCCLocation(){
    if (document.getElementsByTagName('video')[0].currentTime != this.currentTime){
      this.currentTime = document.getElementsByTagName('video')[0].currentTime;
      try{
        const currentCCID = this.simpleCC.find(el => (el.start <= this.currentTime) && (el.end >= this.currentTime) ).id;
        $('#cc-text-'+currentCCID).addClass('current');
        $('.cc-text:not(#cc-text-'+currentCCID+')').removeClass('current');
        // For auto scroll
        if (this.autoScrollEnabled) {
          const currentElement = document.getElementById('cc-text-' + currentCCID);
          const captionBox = document.getElementById('caption-box');

          if (currentElement && captionBox) {
            const boxTop = captionBox.scrollTop;
            const boxHeight = captionBox.clientHeight;
            const elTop = currentElement.offsetTop;
            const elHeight = currentElement.offsetHeight;

            if (elTop < boxTop || elTop + elHeight > boxTop + boxHeight) {
              captionBox.scrollTo({
                top: elTop - boxHeight / 2 + elHeight / 2,
                behavior: 'smooth'
              });
            }
          }
        }
      }catch{};

    }
  }

  /**
   *
   * Create the popup box for the download menu
   */
  toggleDownloadBox(x): void {
    if (x == 1) {
      $('.download-box').show();
    } else if (x == 0) {
      $('.download-box').hide();
    }
  }


  /**
   * Go to a specific time in the video.
   * @param index - the time (in seconds) to jump to.
   */
  goToVideoSegment(index: number): void {

    const player = document.getElementsByTagName('video')[0];
    player.currentTime = index;

  }

  /**
   * Switches search view to Details page of featured result.
   * @param detailsObj - object containing details for result to be featured
   */
	goToRadioDetails(detailsObj): void {
    this.showradio=true;
    this.showDetails=true;
    this.featuredDetails = detailsObj;
    console.log(this.featuredDetails);
    const clipPath = '/home/henry/RadioClips/' + this.featuredDetails['SName'] + '/' + this.featuredDetails['FName'];
    const strLength = clipPath.length;
    this.radioSource = this.radioSourceBase + clipPath.substring(0, strLength - 3) + 'wav';
    this.radioSegments = [];
    const player = document.getElementsByTagName('audio')[0];
    console.log(player);

    console.log('radioSource: %s', this.radioSource);
    console.log('radioResults: %d', this.radioResults);
  }

   /**
   * Create a radio segment every 10 seconds
   */
  createRadioSegments(): void {
    $('.caption-box').show();
    const player = document.getElementsByTagName('audio')[0];
    this.radioDuration = player.duration;
    for(let i = 10; i < this.radioDuration; i = i + 10) {
      this.radioSegments.push(i);
    }
  }

  /**
   * Go to a specific time in the radio.
   * @param index - the time (in seconds) to jump to.
   */
  goToRadioSegment(index: number): void {

    const player = document.getElementsByTagName('audio')[0];
    player.currentTime = index;

  }
  /**
   * Creates a string of search information.
   * @param data - the SearchInformation object to be sent in a query
   * @param newsIds - the newspaper result IDs
   * @param magIds - the magazine result IDs
   */
  encodeQueryData(data: SearchInformation, newsIds, magIds, socialMediaIds, radioIds, televisionIds, fileTypes=[]): string {
    const ret = [];
    for (const d in data) {
ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
}

    ret.push(encodeURIComponent('fileTypes') + '=' + JSON.stringify(fileTypes));
    ret.push(encodeURIComponent('newspaperResults') + '=' + JSON.stringify(newsIds));
    ret.push(encodeURIComponent('magazineResults') + '=' + JSON.stringify(magIds));
    ret.push(encodeURIComponent('socialMediaResults') + '=' + JSON.stringify(socialMediaIds));
    ret.push(encodeURIComponent('radioResults') + '=' + JSON.stringify(radioIds));
    ret.push(encodeURIComponent('televisionResults') + '=' + JSON.stringify(televisionIds));
    return ret.join('&');
  }

  /**
   * Create string of report formats in email alert using current search form.
   * @returns {string} - string of user-chosen report formats
   */
  _reportFormats(): string {
    let formats = '';
    if (this.searchForm.formatEmail) {
      formats += 'email ';
    }
    if (this.searchForm.formatDoc) {
      formats += 'doc ';
    }
    if (this.searchForm.formatExcel) {
      formats += 'excel ';
    }
    if (this.searchForm.formatPDF) {
      formats += 'pdf ';
    }
    if (this.searchForm.formatHTML) {
      formats += 'html';
    }
    return formats;
  }

  /**
   * Creates a SearchInformation object from the current component
   * @returns {SearchInformation} - the form created
   */
  getSearchInfo(): SearchInformation {
    return {
      language: this.searchForm.language,
      searchQuery: this._queryStringFromKeywords(),
      numOfRecords: + this.searchForm.numOfResults + 1,
      mediaType: JSON.stringify(this.mediaTypeHash),
      selectedChannel: this.searchForm.denverTelevision,
      selectedNewspaper: this.searchForm.newspaperSelection,
      selectedMagazine: this.searchForm.magazineSelection,
      selectedSocialMedia: this.searchForm.socialMediaSelection,
      selectedRadio: this.searchForm.radioSelection,
      country: this.searchForm.country,
      stateProvince: this.searchForm.stateProv,
      city: this.searchForm.city,
      startDateTime: SearchComponent.convertDateFormat(this.searchForm.startDate) + ' ' + this.searchForm.startTime,
      endDateTime: SearchComponent.convertDateFormat(this.searchForm.endDate) + ' ' + this.searchForm.endTime,

      startDate: this.searchForm.startDate,
      endDate: this.searchForm.endDate,
      startTime: this.searchForm.startTime,
      endTime: this.searchForm.endTime,

      realTimeAlerts: this.searchForm.realTimeAlerts,
      emailAddresses: this.authService.currentUserValue.email,
      reportFormats: this._reportFormats()
    };
  }

  /**
   * Converts the date from yyyy-mm-dd (as seen in Google Chrome) to mm/dd/yyyy to be used in database querying
   * @param date - the date to convert in the format yyyy-mm-dd
   * @return {string} - the date converted to the format mm/dd/yyyy
   */
  static convertDateFormat(date): string {
    if (date.charAt(4) === '-') { // yyyy-mm-dd format
      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 10);
      return month + '/' + day + '/' + year;
    } else { // mm/dd/yyyy format (should be this format when entered manually)
      return date;
    }
  }


  /**
   * Selects/Deselects all of the newspaper results and updates the newspaperId list accordingly
   */
  toggleAllNewsResults(): void {
    if (!this.allNewsResultsSelected) {
      $('input[name=newsResult]').prop('checked', true);

      // Adds all newspaper results to selected sources
      this.newspaperResults.forEach(article => 
        this.toggleSelection({id: article.ID, name: article.Title}, {target: {checked: true} } as any)
      );

      $('#newsCheckAll').html('Deselect All');
      this.newspaperLocations = [];

      if(this.toggleAll['newspaper'].checked){
        this.totalSnippetsChecked -= this.newspaperIds.length;
      }

      for (const article of this.newspaperResults) {
        // updates newspaperIds
        this.newspaperIds = this.updateSectionIds(article.ID, 'newspaper');
      }
      this.allNewsResultsSelected = true;
    } else {
      $('input[name=newsResult]').prop('checked', false);
      this.newspaperResults.forEach(article => 
        this.toggleSelection({id: article.ID, name: article.Title}, {target: {checked: false} } as any)
      );
      $('#newsCheckAll').html('Select All');
      this.totalSnippetsChecked -= this.newspaperIds.length;
      this.newspaperIds = [];
      this.newspaperLocations = [];
      this.allNewsResultsSelected = false;

      this.updateDownloadButtonText();
    }
  }

  /**
   * Selects/Deselects all of the magazine results and updates the magazineId list accordingly
   */
  toggleAllMagazineResults(): void {
    if (!this.allMagResultsSelected) {
      $('input[name=magResult]').prop('checked', true);
      $('#magCheckAll').html('Deselect All');
      this.magazineLocations = [];

      if(this.toggleAll['magazine'].checked){
        this.totalSnippetsChecked -= this.magazineIds.length;
      }

      for (const article of this.magazineResults) {
        // updates magazine ids
        this.magazineIds = this.updateSectionIds(article.ID, 'magazine');
      }
      this.allMagResultsSelected = true;
    } else {
      $('input[name=magResult]').prop('checked', false);
      $('#magCheckAll').html('Select All');
      this.totalSnippetsChecked -= this.magazineIds.length;
      this.magazineIds = [];
      this.magazineLocations = [];
      this.allMagResultsSelected = false;

      this.updateDownloadButtonText();
    }
  }

  /**
   * Selects/Deselects all of the radio results and updates the radioId list accordingly
   */
  toggleAllRadioResults(): void {
    if (!this.allRadioResultsSelected) {
      $('input[name=radResult]').prop('checked', true);
      $('#radioCheckAll').html('Deselect All');
      this.radioLocations = [];

      if(this.toggleAll['radio'].checked){
        this.totalSnippetsChecked -= this.radioIds.length;
      }

      for (const radio of this.radioResults) {
        // updates radio ids
        this.radioIds = this.updateSectionIds(radio.ID, 'radio');
      }
      this.allRadioResultsSelected = true;
    } else {
      $('input[name=radResult]').prop('checked', false);
      $('#radioCheckAll').html('Select All');
      this.totalSnippetsChecked -= this.radioIds.length;
      this.radioIds = [];
      this.radioLocations = [];
      this.allRadioResultsSelected = false;

      this.updateDownloadButtonText();
    }
  }

  /**
   * Selects/Deselects all of the newspaper results and updates the newspaperId list accordingly
   */
  toggleAllSocialMediaResults(): void {
    if (!this.allSocialMediaResultsSelected) {
      $('input[name=socialMediaResult]').prop('checked', true);
      $('#socialMediaCheckAll').html('Deselect All');
      this.socialMediaLocations = [];

      console.log(this.socialMediaIds);

      if(this.toggleAll['socialMedia'].checked){
        this.totalSnippetsChecked -= this.socialMediaIds.length;
      }

      console.log(this.socialMediaResults);
      for (const article of this.socialMediaResults) {
        this.socialMediaIds = this.updateSectionIds(article.id, 'socialMedia');
      }
      this.allSocialMediaResultsSelected = true;
    } else {
      $('input[name=socialMediaResult]').prop('checked', false);
      $('#socialMediaCheckAll').html('Select All');
      this.totalSnippetsChecked -= this.socialMediaIds.length;
      this.socialMediaIds = [];
      this.socialMediaLocations = [];
      this.allSocialMediaResultsSelected = false;

      this.updateDownloadButtonText();
    }
  }

  /**
   * Selects/Deselects all of the tv results and updates the televisionID list accordingly
   */
  toggleAllTVResults(): void {
    if (!this.allTVResultsSelected) {
      $('input[name=tvResult]').prop('checked', true);
      $('#tvCheckAll').html('Deselect All');

      if(this.toggleAll['television'].checked){
        this.totalSnippetsChecked -= this.televisionIds.length;
      }

      this.televisionLocations = [];
      this.selectedVideos = [];
      for (const group of this.televisionResults) {
        this.televisionIds = this.updateSectionIds(group.location, 'television');

        const videos = group.data[0];
        if (!this.selectedVideos.includes(videos)) {
          this.selectedVideos.push(videos);
        }
      }
      this.allTVResultsSelected = true;
    } else {
      $('input[name=tvResult]').prop('checked', false);
      $('#tvCheckAll').html('Select All');
      this.totalSnippetsChecked -= this.televisionIds.length;
      this.televisionIds = [];
      this.televisionLocations = [];
      this.selectedVideos = [];
      this.allTVResultsSelected = false;

      this.updateDownloadButtonText();
    }
  }


  addAllIds(section: string) {
    let ids;
    let results;
    let identifier = 'ID';
    switch (section) {
      case 'newspaper':
        ids = this.newspaperIds;
        results = this.newspaperResults;
        break;
      case 'magazine':
        ids = this.magazineIds;
        results = this.magazineResults;
        break;
      case 'radio':
        ids = this.radioIds;
        results = this.radioResults;
        break;
      case 'socialMedia':
        ids = this.socialMediaIds;
        results = this.socialMediaResults;
        identifier = 'id';
        break;
      case 'television':
        ids = this.televisionIds;
        results = this.televisionResults;
        identifier = 'location';
        break;

      default:
        break;
    }

    // add each id to the ids array.
    // The tempIds is needed because ids is a reference to the actual sections
    // array (eg. this.newspaperIds)
    let tempIds;
    for (const snippet of results) {
      tempIds = this.updateSectionIds(snippet[identifier], section, true);
    }
    ids.push(...tempIds);
  }

   /**
   * Adds or removes the article from the ID list based on checkbox selection or deselection
   * @param ID - the snippet ID to add or remove
   * @param section - the section/category to update (newspaper, magazines, etc.)
   * @param skipCheckedUpdate - default to false. If true, will skip updating how many snippets are selected
   */
  updateSectionIds(ID, section, skipCheckedUpdate=false): number[] {
    let results;
    let locations;

    /* different sections have different keys. Newspaper checks 'ID',
    social media checks 'id' television checks 'location'*/
    let identifier = 'ID';

    // update results & locations based on
    // which section had a checkbox pressed
    switch (section) {
      case 'newspaper':
        results = this.newspaperResults;
        locations = this.newspaperLocations;
        break;
      case 'magazine':
        results = this.magazineResults;
        locations = this.magazineLocations;
        break;
      case 'radio':
        results = this.radioResults;
        locations = this.radioLocations;
        break;
      case 'socialMedia':
        results = this.socialMediaResults;
        locations = this.socialMediaLocations;
        identifier = 'id';
        break;
      case 'television':
        results = this.televisionResults;
        locations = this.televisionLocations;
        identifier = 'location';
        break;

      default:
        break;
    }

    let isUnchecked = false;

    for (let location = 0; location < results.length && !isUnchecked; location++) {
      if (results[location][identifier] === ID) { // determines the position of the article in the search results
        for (let j = 0; j < locations.length && !isUnchecked; j++) {
          if (location === locations[j]) { // position is already accounted for the checkbox was unchecked
            locations.splice(j, 1); // remove the position of the article from the list
            isUnchecked = true;

          }
        }
        if (!isUnchecked) { // box was checked
          locations.push(location); // add the position of the article
        }
      }
    }

    const ids = this.formatSectionIdList(results, locations, identifier);
    if(!skipCheckedUpdate){
      this.updateCheckedSections(section, ids, isUnchecked);
    }

    // return formatted ID's array
    return ids;
  }

  /**
   * Formats the ID/location List while preserving chronological order.
   * @param results - the array of search results
   * @param locations - the locations of the checked snippets
   * @return {number[]} - the array of formatted snippet IDs
   */
   formatSectionIdList(results, locations, identifier): number[] {
    const ids = [];
    locations.sort(); // allows the list to keep chronological order for report generation
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (i === locations[j]) {
          ids.push(results[i][identifier]);
        }
      }
    }

    return ids;
  }

  // checks what snippets are checked, and updates the total snippets checked
  updateCheckedSections(section: string, sectionIds, isUnchecked: boolean): void {
    let empty = false; // if the section passed has none checked

    // if the current section IDs (eg. newspaper.ids) is empty
    if(sectionIds.length == 0){
      // set the checked to false, and decrement total snippets checked
      this.toggleAll[section].checked = false;
      this.totalSnippetsChecked--;
      empty = true;
    }else { // if not empty
      this.toggleAll[section].checked = true;

      // if it was checked, increase total snippets selected
      if(!isUnchecked) {
        this.totalSnippetsChecked++;
      }else{// otherwise decrement
        this.totalSnippetsChecked--;
      }
    }

    const excludedSections = [];
    let allEmpty = true; // if all sections are not checked, except the passed section

    // will clear all ids when a snippet is selected (by default, everything is selected)
    for(const sect of Object.keys(this.toggleAll)){
      if(sect !== section && this.toggleAll[sect].checked){
        excludedSections.push(sect);
        allEmpty = false;
        break;
      }
    }

    if(allEmpty){
      this.clearIds(excludedSections);
    }

    this.updateDownloadButtonText();

  }

  clearIds(excludedSections: string[]) {
    if(!(excludedSections.includes('newspaper'))) {
      this.newspaperIds = [];
    }
    if(!(excludedSections.includes('magazine'))) {
      this.magazineIds = [];
    }
    if(!(excludedSections.includes('radio'))) {
      this.radioIds = [];
    }
    if(!(excludedSections.includes('socialMedia'))) {
      this.socialMediaIds = [];
    }
    if(!(excludedSections.includes('television'))) {
      this.televisionIds = [];
    }
  }

  updateDownloadButtonText() {
    if(this.totalSnippetsChecked == 0){
      this.downloadButtonText = 'all';
    }else{
      this.downloadButtonText = '(' + this.totalSnippetsChecked + ')';
    }
  }

  /**
   * Displays radio results from response from server.
   */
  displayRadioResults(): void {
    if (this.radioResults.length > Number(this.searchForm.numOfResults)) {
      this.rdResultsExtra = true;
    } else {
      this.rdResultsExtra = false;
    }
    while (this.radioResults.length > Number(this.searchForm.numOfResults)) {
      this.radioResults.pop();
    }
    this.rdResults = this.radioResults.length;
    for (const key in this.radioResults) {
      const match = this.radioResults[key].FName.match(/^.*\/\w+\/(\w+)\.\w+$/);
      const title = (match ? match[1] : '') || this.radioResults[key].FName;
      this.radioResults[key].Title = this.highlightWords(title);

      var str=this.radioResults[key].TEXTS;
      var start=1000000;
      let len=200;
      let flag1=0;
      let flag2=1;
      var tmp=0;
      str=str.toLowerCase();
      const keywords = (this.searchForm.keywords_string).split(',');
      keywords.forEach((keys) =>{
        tmp=str.indexOf(keys.toLowerCase());
        if (tmp<start){
          start=tmp;
}
        }
      );
      if (start<200){
        start=0;
        flag1=1;
      }
      if (start+201>str.length){
        len=str.length-start;
        flag2=0;
      }
      let str2=str.substring(start,start+len);
      if (flag1==0){
        str2='......'+str2;
      }
      if (flag2==1){
        str2+='......';
      }
      this.radioResults[key].Summary = this.highlightWords(str2);
    }
  }

  /**
   * Creates an array of IDs using an array of results.
   * @param results - the server response containing an array of results
   * @param ids - the array of IDs to populate
   */
  createIDList(results, ids, identifier='ID'): void {
    for (const key in results) {
      ids.push(results[key][identifier]);
    }
  }

  /**
   * Creates an array of tv locations using an array of results.
   * @param results - the server response containing an array of results
   * @param locations - the array of tv locations to populate
   */
  createIDListTV(results, locations): void {
    for (const key in results) {
      locations.push(results[key].location);
    }
  }

/** TODO - this code is unused
 * Creates a list of all of the checked results to download
 * @param results - The list of all of the results
 * @param ids - The ids of all of the checked results
 *
 * @returns The list of checked results
 */
  getAllChecked(results, ids) {
    const downloadableList = []; // The list of all checked results
    for (const key in results) {
      if (ids.includes(results[key].ID)){
        downloadableList.push(results[key]);
      }
    }

    return downloadableList;
  }

  /** TODO - this code is unused
   * Creates a list of all of the checked results to download
   * @param results - The list of all of the results
   * @param ids - The ids of all of the checked results
   */
    getAllCheckedTV(results, locations) {
      const downloadableList = []; // The list of all checked results
      for (const key in results) {
        if (locations.includes(results[key].location)){
          downloadableList.push(results[key]);
        }
      }

      return downloadableList;
    }

  /**
   * Opens link to download results as in html format.
   */
  generatePDF(): void {
    this.download('pdf');
  }

  /**
   * Opens link to download results as in docx format.
   */
  downloadDocx(): void {
    this.download('docx');
   }

  downloadHtml(): void {
    this.download('html');
  }

  /**
   * Opens link to download results as in xlsx format.
   */magazine;
  downloadXlsx(): void {
    this.download('xlsx');
  }

  /**
   * Opens link to download results in all formats.
   */
  downloadAll(): void {
    this.download('all');
  }

  downloadSelected(): void {
    this.download('zip');
  }

  addDownloadFormat(format: string) {
    this.downloadFormats.push(format);
  }

  toggleFormat(event, format: string){
    event.stopPropagation();

    let checked = $('input[name=' + format + ']').is(':checked');

    if(event.target.type === 'checkbox'){
      checked = !checked;
    }

    if(checked){
      $('input[name=' + format + ']').prop('checked', false);
      this.downloadFormats.forEach( (currentFormat, index) => {
        if(format === currentFormat) {
this.downloadFormats.splice(index,1);
}
      });
    }else{
      $('input[name=' + format + ']').prop('checked', true);
      this.downloadFormats.push(format);
    }
  }

  download(fileType: string){
    const searchForm = this.getSearchInfo();

    // if there are no snippets checked, and only if every ids array is empty
    // if they aren't empty it would mean nothing has been clicked yet
    if(this.totalSnippetsChecked == 0 && this.newspaperIds.length == 0){
      this.addAllIds('newspaper');
      this.addAllIds('magazine');
      this.addAllIds('radio');
      this.addAllIds('socialMedia');
      this.addAllIds('television');
      this.totalSnippetsChecked = 0;
    }


    window.open(this.url+'/'+fileType+'?' + this.encodeQueryData(searchForm, this.newspaperIds,
      this.magazineIds, this.socialMediaIds, this.radioIds, this.televisionIds, this.downloadFormats));
  }


  emailResults(): void {
  const searchForm = this.getSearchInfo();
  //   emailaddresses, magResults, newspaperResults, radioResults, tvResults, reportFormats
  // this.emailService.sendEmail(searchForm,magList, newsList, radList, socList, this.televisionResults)
  //   .subscribe(response => {
  //     $("Email Sent").modal();
  //   });

    window.open(this.url+'/sendPage?' + this.encodeQueryData(searchForm, this.newspaperIds,
      this.magazineIds, this.socialMediaIds, this.radioIds, this.televisionIds));
    // var htmlString = generateHtml(searchForm.searchQuery, searchForm.mediaType, searchForm.selectedChannel, searchForm.selectedNewspaper, searchForm.selectedMagazine, searchForm.selectedSocialMedia, searchForm.country, searchForm.stateProvince, searchForm.city, searchForm.startDateTime, searchForm.endDateTime, searchForm.startDate, searchForm.endDate, searchForm.startTime, searchForm.endTime, searchForm.numOfRecords, this.allTVResultsSelected, this.allNewsResultsSelected, this.allMagResultsSelected, this.searchForm.country == 'All', this.searchForm.stateProv == 'All', this.searchForm.city == 'All', this.newspaperIds, this.magazineIds, this.socialMediaIds, searchForm.selectedRadio, this.radioIds, this.televisionIds);
    // sendEmail('mortendhermann1997@gmail.com', 'DigiClips Search Result', htmlString);
  }

  /**
   * Creates query string from this.keywords_string.
   * @returns {string} - string to be used in search queries
   * The '+' needed for binary mode query is a forbidden char so
   * '/&&/' is replaced by '+' in stored proc Simple_Search or Bool_Search
   */
  _queryStringFromKeywords(): string {
    const keywords = this.searchForm.keywords_string
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .map(w => `/&&/"${w}"`);

    const orWords = this.searchForm.or_search_string
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .map(w => `"${w}"`);

    const notWords = this.searchForm.not_search_string
      .split(',')
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .map(w => `-"${w}"`);

    return [...keywords, ...orWords, ...notWords].join(' ');
  }


  /**
   * Switches search view back to search results list.
   */
  backToResults(): void {
    this.showDetails = false;
    this.showradio=false;
    this.showDL=false;
  }

  /* */

  /**
   * Toggles the caption to be viewed or hidden
   */
toggleCaption(): void {
  this.showCaptions = !this.showCaptions;
}

  /**
   * Ensure time input is valid for download
   */
  checkInput(): boolean {
    if(this.downloadForm.startTime.length == 8 && this.downloadForm.endTime.length == 8) {
      if(this.downloadForm.startTime.charAt(2) == ':' && this.downloadForm.startTime.charAt(5) == ':' && this.downloadForm.endTime.charAt(2) == ':' && this.downloadForm.endTime.charAt(5) == ':') {
        try {
        const start_hou = Number(this.downloadForm.startTime.substring(0,2));
        const start_min = Number(this.downloadForm.startTime.substring(3,5));
        const start_sec = Number(this.downloadForm.startTime.substring(6,8));

        const end_hou = Number(this.downloadForm.endTime.substring(0,2));
        const end_min = Number(this.downloadForm.endTime.substring(3,5));
        const end_sec = Number(this.downloadForm.endTime.substring(6,8));

        if((start_hou == end_hou && end_min < start_min) || (start_hou == end_hou && end_min == start_min && end_sec <= start_sec)) {
          // return "Invalid time range: Negative or Zero time value";
          return false;
        }

        if((start_hou == end_hou && end_min - start_min < 10) || (start_hou == end_hou && end_min - start_min == 10 && end_sec < start_sec) || (start_hou < end_hou && (end_min + 60) - start_min < 10) || (start_hou < end_hou && (end_min + 60) - start_min == 10 && end_sec < start_sec)) {
          if(start_hou < 60 && start_min < 60 && start_sec < 60 && end_hou < 60 && end_min < 60 && end_sec < 60) {
            // return "gg";
            return true;
          } else {
            // return "Invalid Time Range: Clip must be less than 10 min";
            return false;
          }
        } else {
          // return "Invalid Time Range: Negative time value";
          return false;
        }
        } catch(e) {
          // return "Use valid number formatting";
          return false;
        }

        
      } else {
        // return "Invalid entry format: use format hh:mm:ss";
        return false;
      }
    } else {
    // return "Invalid entry length: use format hh:mm:ss";
    return false;
    }
  }

  /**
   * Runs ffmpeg via shell script to convert media and enable it for download
   */
  runFFMPEG(): void {
    const sm = (document.getElementById('startMinutes') as HTMLInputElement).value || '0';
    const ss = (document.getElementById('startSeconds') as HTMLInputElement).value || '0';
    const em = (document.getElementById('endMinutes') as HTMLInputElement).value || '0';
    const es = (document.getElementById('endSeconds') as HTMLInputElement).value || '0';

    const startTime = `00:${sm.padStart(2, '0')}:${ss.padStart(2, '0')}`;
    const endTime = `00:${em.padStart(2, '0')}:${es.padStart(2, '0')}`;

    // Check for valid timestamps
    function isValidTimestamp(ts: string): boolean {
      return /^(\d{2}):([0-5][0-9]):([0-5][0-9])$/.test(ts);
    }

    if (!isValidTimestamp(startTime) || !isValidTimestamp(endTime)) {
      this.showToast('Invalid timestamp: use hh:mm:ss format (e.g., 00:01:30)');
      return;
    }

    // Convert timestamp to seconds
    function timestampToSeconds(ts: string): number {
      const [hh, mm, ss] = ts.split(':').map(Number);
      return hh * 3600 + mm * 60 + ss;
    }

    const startSeconds = timestampToSeconds(startTime);
    const endSeconds = timestampToSeconds(endTime);

    if (startSeconds >= endSeconds && endSeconds !== 0) {
      this.showToast('Start time must be before end time');
      return;
    }

    if (!this.featuredDetails || !this.featuredDetails['Mp4_File_Name']) {
      alert('No video selected.');
      return;
    }

    const file = this.featuredDetails['Mp4_File_Name'];
    const file_pos = file.lastIndexOf('/');
    this.downloadForm.fileName = file.substring(file_pos + 1, file.length - 4);
    this.downloadForm.routeToFile = file.substring(0, file_pos + 1);
    this.downloadForm.startTime = startTime;
    this.downloadForm.endTime = endTime;

    this.http.post(`${this.url}/dlMedia`, this.downloadForm, {
      responseType: 'blob',
      withCredentials: true
    }).subscribe(blob => {
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${this.downloadForm.fileName}.${this.downloadForm.format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    }, error => {
      alert('Failed to generate clip. Check permissions or backend logs.');
      console.error(error);
    });
  }

  /**
   * Runs ffmpeg via shell script to convert media and enable it for download
   *
   * SHOULDN'T HARDCODE FILE PATH !!!!!!!!!!
   *'/home/henry/front/front/server/'
   *
   */
  getFile(): string {
    open('/home/henry/front/server/' + this.downloadForm.fileName + '_' + this.downloadForm.startTime + '_' + this.downloadForm.endTime + '.' + this.downloadForm.format);
    return '';

  }

  collapsed(event:any):void{
    console.log(event);
  }

  expanded(event:any):void{
    console.log(event);
  }

  // Toggle selection of a media source
  toggleSelection(source: { id: number; name: string }, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedSources.push(source);
    } else {
      this.selectedSources = this.selectedSources.filter((item) => item.id !== source.id);
    }
  }

  // Add selected sources to the bookmarked list and open the menu
  bookmarkSelectedSources() {
    // If the menu is already open, close it
    if (this.bookmarkMenuVisible) {
      this.bookmarkMenuVisible = false;
      return;
    }

    // Otherwise, bookmark the selected sources and open the menu
    if (this.selectedSources.length > 0) {
      this.selectedSources.forEach((source) => {
        const alreadyBookmarked = this.bookmarkedSources.some((b) => b.id === source.id);
        if (!alreadyBookmarked) {
          this.bookmarkedSources.push(source);
        }
      });

      // Clear selected sources
      this.selectedSources = [];

      // Reset checkboxes in the DOM
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="mediaResult"]');
      checkboxes.forEach((checkbox) => {
        (checkbox as HTMLInputElement).checked = false;
      });
    }

    // Open the bookmark menu
    this.bookmarkMenuVisible = true;
  }

  // Toggle the bookmark menu visibility
  toggleBookmarkMenu() {
    this.bookmarkMenuVisible = !this.bookmarkMenuVisible;
  }

  // Download selected sources or all sources
  downloadSelectedSources() {
    if (this.selectedSources.length === 0) {
      console.log('Downloading all sources as .zip');
      // Logic for downloading all sources
    } else {
      console.log('Downloading selected sources:', this.selectedSources);
      // Logic for downloading selected sources
    }

  // Clear selected sources after downloading
  this.selectedSources = [];

  // Reset checkboxes in the DOM
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="mediaResult"]');
  checkboxes.forEach((checkbox) => {
    (checkbox as HTMLInputElement).checked = false;
  });
  }

  // Get the label for the bookmark button based on the number of selected sources
  getBookmarkButtonLabel(): string {
    if (this.selectedSources.length === 0) {
      return 'Bookmarks';
    }
    return `Bookmark (${this.selectedSources.length})`;
  }


  // Close the bookmark menu when clicking outside of it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInsideMenu = this.elementRef.nativeElement.querySelector('.bookmark-menu')?.contains(event.target as Node);
    const clickedOnButton = (event.target as HTMLElement).id === 'floatingBookmark';

    if (!clickedInsideMenu && !clickedOnButton && this.bookmarkMenuVisible) {
      this.bookmarkMenuVisible = false;
    }
  }

  // Get the label for the download button based on the number of selected sources
  getDownloadButtonLabel(): string {
    return this.selectedSources.length > 0 ? `Download Selected (${this.selectedSources.length})` : 'Download';
  }

  // Invalid timestamp message
  showToast(message: string) {
    const toast = document.getElementById('toast');
    if (!toast) {
return;
}

    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 3000); // visible for 3 seconds
  }

  redirectToRegister(): void {
    this.authService.logout(); // Clear guest session
    this.router.navigate(['/register'], {
      queryParams: {
        message: 'Please register for unlimited access to DigiClips'
      }
    });
  }

  // ========== comment functions: ==========

  /**
   * toggle comment section visibility for specifid search result
   * @param resultId
   */
  toggleComments(resultId: string): void {
     this.expandedComments[resultId] = !this.expandedComments[resultId];
    
    if (this.expandedComments[resultId] && !this.commentsData[resultId]) {
      this.http.get(`${this.url}/api/comments/${resultId}`).subscribe(
        (comments: any[]) => {
          this.commentsData[resultId] = comments.map(c => ({
            id: c.id,
            userId: c.user_email,
            username: c.user_email,
            text: c.comment_text,
            timestamp: new Date(c.created_at),
            likes: c.likes,
            dislikes: c.dislikes,
            replies: c.replies?.map(r => ({
              id: r.id,
              userId: r.user_email,
              username: r.user_email,
              text: r.reply_text,
              timestamp: new Date(r.created_at)
            })) || []
          }));
        },
        error => console.error('Error fetching comments:', error)
      );
    }
  }

  isCommentsExpanded(resultId: string): boolean {
    return this.expandedComments[resultId] || false;
  }

  /**
   * get comments for a search result
   */
  getComments(resultId: string): any[] {
    return this.commentsData[resultId] || [];
  }

  /**
   * add new comment to a search result
   * @param resultId - unique identifier for the result
   * @param commentText - the comment text
   */
  addComment(resultId: string, commentText: string): void {
    if (!commentText || commentText.trim() === '') {
        return;
      }

      this.http.post(`${this.url}/api/comments`, {
        resultId,
        text: commentText,
        userEmail: this.authService.currentUserValue?.email || 'guest'
      }).subscribe(
        (newComment: any) => {
          if (!this.commentsData[resultId]) {
            this.commentsData[resultId] = [];
          }
          this.commentsData[resultId].unshift({
            id: newComment.id,
            userId: newComment.user_email,
            username: newComment.user_email,
            text: newComment.comment_text,
            timestamp: new Date(newComment.created_at),
            likes: 0,
            dislikes: 0,
            replies: []
          });
        },
        error => console.error('Error adding comment:', error)
      );
  }

  /**
   * delete a comment
   * @param resultId 
   * @param commentId 
   */

  deleteComment(resultId: string, commentId: number): void {
  this.http.delete(`${this.url}/api/comments/${commentId}`, {
    body: {
      userEmail: this.authService.currentUserValue?.email || 'guest'
    }
  }).subscribe({
    next: () => {
      if (this.commentsData[resultId]) {
        this.commentsData[resultId] = this.commentsData[resultId].filter(
          (comment: any) => comment.id !== commentId
        );
      }
    },
    error: (error) => console.error('Error deleting comment:', error)
  });
}


  /**
   * edit a comment
   * @param newText 
   * @param resultId 
   * @param commentId 
   */
  editComment(newText: string ,resultId: string, commentId: number){
     if (!newText || newText.trim() === '') {
      return;
    }

   
    this.http.put(`${this.url}/api/comments/${commentId}`, {
      text: newText,
      userEmail: this.authService.currentUserValue?.email || 'guest'
    }).subscribe(
      (updatedComment: any) => {
        const comment = this.findComment(resultId, commentId);
        if(comment){
          comment.text = updatedComment.text;
          comment.timestamp = new Date(updatedComment.updated_at);
        }
      },
      error => console.error('error editing comment', error)
    );
    
  }

  /**
   * like a comment
   * @param resultId
   * @param commentId
   */
  likeComment(resultId: string, commentId: number): void {
   this.http.post(`${this.url}/api/comments/${commentId}/like`, {
      userEmail: this.authService.currentUserValue?.email || 'guest'
    }).subscribe(
      (response: any) => {
        const comment = this.findComment(resultId, commentId);
        if (comment) {
          if (response.action === 'added_like') {
            comment.likes++;
          } else if (response.action === 'removed_like') {
            comment.likes--;
          } else if (response.action === 'changed_to_like') {
            comment.likes++;
            comment.dislikes--;
          }
        }
      },
      error => console.error('Error liking comment:', error)
    );
  }

  /**
   * dislike a comment
   * @param resultId 
   * @param commentId 
   */
  dislikeComment(resultId: string, commentId: number): void {
     this.http.post(`${this.url}/api/comments/${commentId}/dislike`, {
      userEmail: this.authService.currentUserValue?.email || 'guest'
    }).subscribe(
      (response: any) => {
        const comment = this.findComment(resultId, commentId);
        if (comment) {
          if (response.action === 'added_dislike') {
            comment.dislikes++;
          } else if (response.action === 'removed_dislike') {
            comment.dislikes--;
          } else if (response.action === 'changed_to_dislike') {
            comment.dislikes++;
            comment.likes--;
          }
        }
      },
      error => console.error('Error disliking comment:', error)
    );
  }



  /**
   * add reply to comment
   * @param resultId
   * @param commentId
   * @param replyText
   */
  addReply(resultId: string, commentId: number, replyText: string): void {
    if (!replyText || replyText.trim() === '') {
      return;
    }

    // TODO: backend api call

    // mock up for now
    const comment = this.findComment(resultId, commentId);
    if (!replyText || replyText.trim() === '') {
      return;
    }

    this.http.post(`${this.url}/api/comments/${commentId}/reply`, {
      text: replyText,
      userEmail: this.authService.currentUserValue?.email || 'guest'
    }).subscribe(
      (newReply: any) => {
        const comment = this.findComment(resultId, commentId);
        if (comment) {
          if (!comment.replies) {
            comment.replies = [];
          }
          comment.replies.push({
            id: newReply.id,
            userId: newReply.user_email,
            username: newReply.user_email,
            text: newReply.reply_text,
            timestamp: new Date(newReply.created_at)
          });
        }
      },
      error => console.error('Error adding reply:', error)
    );
  }

  /**
   * search for keyword in comments
   * @param keyword
   * @param resultId
   */
  searchComments(keyword: string, resultId: string): void{
    console.log('Search comments:', keyword);

    if(keyword == ' '){
      return;
    }

    const comments = this.commentsData[resultId];
    const substrings = [keyword];
    
    
    for(var com of comments){
      const text = com.text;

      if (com.text.includes(keyword)){
        const chunks = getChunks({
          text,
          substrings,
        });

        const highlightedText = chunks.map(({ highlighted, text }) => (highlighted ? `<mark>${text}</mark>` : text)).join('');
        com.text = highlightedText;
      }
    }

    

  }

  /**
   * search for keyword in replies
   * @param keyword
   * @param commentId
   * @param resultId
   * 
   */
  searchReplies(keyword: string, commentId: number, resultId: string): void{
    console.log('Search replies:', keyword);
    const comment = this.findComment(resultId, commentId);
    const substrings = [keyword];

    const replies = comment.replies;
    for(var i in replies){
      const text = i;
      if(i.includes(keyword)){
        const chunks = getChunks({
          text,
          substrings,
        });

        const highlightedText = chunks.map(({ highlighted, text }) => (highlighted ? `<mark>${text}</mark>` : text)).join('');
        i = highlightedText;
      }
    }
  }

  /**
   * helper (finds comment by id)
   */
  private findComment(resultId: string, commentId: number): any {
    const comments = this.commentsData[resultId];
    if (!comments) return null;
    return comments.find(c => c.id === commentId);
  }
}

