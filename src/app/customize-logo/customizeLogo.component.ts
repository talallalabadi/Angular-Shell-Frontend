import { OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {AddMediaService} from '../services/addmedia.service';
import {GlobalVariables} from '../common/global-variables';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';
import { AppComponent } from '../app.component';
import { CustomizeLogoService } from '../services/customizeLogo.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * The magazine object to create.
 */
export class Company {
  name = '';
}

@Component({
    selector: 'app-customizeLogo',
    templateUrl: './customizeLogo.component.html',
    styleUrls: ['./customizeLogo.component.scss'],
    standalone: false
})

/**
 * Customize website with company information
 */
export class CustomizeLogoComponent implements OnInit {
  company: Company = new Company();
  logoImageFile: File = null;
  url = environment.serverUrl;
  ngOnInit(): void {}

  constructor(private http: HttpClient, private customizeLogoService : CustomizeLogoService, private auth: AuthService) {
         this.auth.isVerifiedToAccess();
  }

  /**
   * Sends the new magazine to the database and displays a response message.
   */
  changeCompanyName(): void {
    GlobalVariables.companyName = this.company.name;
    this.customizeLogoService.updateName(this.company.name).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  onFileSelected(event) {
    this.logoImageFile = <File>event.target.files[0];
  }

  changeCompanyLogo(): void {
    // const image = new FormData();
    // image.append('image', this.logoImageFile, this.logoImageFile.name);
    // this.http.post(this.url + "/changeLogo", image)
    //   .subscribe(res => {
    //     console.log(res);
    //   });

    // this.logoImageFile = <File>event.target.files[0];
    AppComponent.logoImage = this.logoImageFile;
  }

  /**
   * Validates that all input criteria has been given.
   */
  checkFilled(): boolean {
    // return this.company.name != '' && this.company.url != '';
    return this.company.name != '';
  }
}
