import { OnInit} from '@angular/core';
import {Component} from '@angular/core';
import {AddMediaService} from '../services/addmedia.service';

/**
 * The magazine object to create.
 */
export class Magazine {
  name = '';
  url = '';
  rss = '';
  country = '';
  state = '';
  city = '';
}

@Component({
    selector: 'app-addMagazine',
    templateUrl: './addMagazine.component.html',
    styleUrls: ['./addMagazine.component.scss'],
    standalone: false
})

/**
 * Adds a new magazine to the database.
 */
export class AddMagazineComponent implements OnInit {
  magazine: Magazine = new Magazine();

  ngOnInit(): void {}

  constructor(private addMediaService: AddMediaService) {
  }

  /**
   * Sends the new magazine to the database and displays a response message.
   */
  addMagazine(): void {
    this.addMediaService.addMagazineToDatabase(this.magazine).subscribe(
      // res => {
      //   // Alert user of success/failure
      //   if (res.status === 200) {
      //     alert("Successful add of magazine to database.");
      //   } else {
      //     alert("Failure adding magazine to database.");
      //   }
      // }
    );
    this.magazine = new Magazine();
  }

  /**
   * Validates that all input criteria has been given.
   */
  checkFilled(): boolean {
    return this.magazine.name != '' && this.magazine.url != '' && this.magazine.rss != ''
      && this.magazine.country != '' && this.magazine.state != '' && this.magazine.city != '';
  }
}
