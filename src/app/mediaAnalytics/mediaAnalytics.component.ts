import { OnInit} from '@angular/core';
import { Component} from '@angular/core';
import { ChartDataset} from 'chart.js';
// import { ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts'; OUT OF DATE 
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
//test
@Component({
    selector: 'app-mediaAnalytics',
    templateUrl: './mediaAnalytics.component.html',
    styleUrls: ['./mediaAnalytics.component.css'],
    standalone: false
})

export class MediaAnalyticsComponent implements OnInit{

  typeDropDown: string;
  tvDropDown: string;
  radioDropDown: string;
  mediaDropDown: string;
  startDate: string;
  endDate: string;

  media: string[];
  tvChannel: string[];
  radioChannel: string[];
  type: string[];
  showGraph: boolean;
  showAudience: boolean;
  showAdValue: boolean;
  showCalAdValue: boolean;
  showCalPublicityValue: boolean;


  /**
   * These data are hard-coded for demo purposes only.
   * The future team will need to setup database connection and fetch the real data from that.
   */
  audience: ChartDataset<'line'>[] = [
  { 
    data: [17569, 13495, 12100, 9004, 7851, 7541],
    label: 'Audience',
    borderColor: 'black',
    backgroundColor: 'rgba(255,255,0,0.28)'
  },
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

  lineChartLabels: string[] = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

    constructor(private auth: AuthService, private router: Router) {
      this.auth.isVerifiedToAccess();
  }

  ngOnInit() {
    this.media = ['Television', 'Radio'];
    this.tvChannel = ['N/A', 'KTVD-DT', 'KUSA-HD', 'KWGN-DT'];
    this.radioChannel = ['N/A', 'R1', 'R2', 'R3'];
    this.type = ['All', 'Audience', 'Ad Value', 'Calc Ad Value', 'Calc Publicity Value'];
    this.showAudience = false;
    this.showCalAdValue = false;
    this.showAdValue = false;
    this.showCalPublicityValue = false;
    this.startDate = '';
    this.endDate = '';
    this.mediaDropDown = 'Television';
    this.tvDropDown = 'N/A';
    this.radioDropDown = 'N/A';
    this.typeDropDown = 'All';
  }

  /**
   * Display graphs based on user's preferences.
   */
  create(): void {

    // display user's request.
    console.log(this.mediaDropDown);
    console.log(this.tvDropDown);
    console.log(this.radioDropDown);
    console.log(this.typeDropDown);
    console.log(this.startDate);
    console.log(this.endDate);

    if((this.tvDropDown != 'N/A' || this.radioDropDown != 'N/A') && this.startDate != '' && this.endDate != '') {
      switch(this.typeDropDown) {
        case 'All': {
          this.showAudience = true;
          this.showAdValue = true;
          this.showCalAdValue = true;
          this.showCalPublicityValue = true;
          break;
        }
        case 'Audience': {
          this.showAudience = true;
          break;
        }
        case 'Ad Value': {
          this.showAdValue = true;
          break;

        }
        case 'Calc Ad Value': {
          this.showCalAdValue = true;
          break;
        }
        case 'Calc Publicity Value': {
          this.showCalPublicityValue = true;
          break;
        }
      }
    }
  }

  /**
   * Go back to the search box.
   */
  createAnother(): void {
    this.showAudience = false;
    this.showAdValue = false;
    this.showCalAdValue = false;
    this.showCalPublicityValue = false;
  }

}

