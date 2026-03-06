import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AddMediaService } from '../services/addmedia.service';

export class Newspaper {
  name = '';
  url = '';
  rss = '';
  country = '';
  state = '';
  city = '';
}

@Component({
    selector: 'app-addNewspaper',
    templateUrl: './addNewspaper.component.html',
    styleUrls: ['./addNewspaper.component.scss'],
    standalone: false
})

export class AddNewspaperComponent implements OnInit {
  newspaper: Newspaper = new Newspaper();

  ngOnInit(): void {}

  constructor(private addMediaService: AddMediaService) {}

  addNewspaper(): void {
    this.addMediaService.addNewspaperToDatabase(this.newspaper).subscribe();

    // Save the newspaper object to local storage
    localStorage.setItem('newspaper', JSON.stringify(this.newspaper));

    this.newspaper = new Newspaper();
  }

  checkFilled(): boolean {
    return this.newspaper.name != '' && this.newspaper.url != '' && this.newspaper.rss != ''
      && this.newspaper.country != '' && this.newspaper.state != '' && this.newspaper.city != '';
  }
}
