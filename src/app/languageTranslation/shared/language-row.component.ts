import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-language-row',
  standalone: true,
  imports: [],
  templateUrl: './language-row.component.html',
  styleUrls: ['./language-row.component.css']
})
export class LanguageRowComponent {

  @Input() letter: string = '';
  @Input() languages: string[] = [];
  @Output() languageSelected = new EventEmitter<string>();

  onLanguageSelect(lang: string) {
    this.languageSelected.emit(lang);
  }
}