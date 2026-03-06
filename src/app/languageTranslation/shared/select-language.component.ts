import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageRowComponent } from './language-row.component';

@Component({
  selector: 'app-select-language',
  standalone: true,
  imports: [
    CommonModule,
    LanguageRowComponent
],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css']
})
export class SelectLanguageComponent {
  @Input() selectedLanguage: string = 'English'; 
  @Output() languageSelected = new EventEmitter<string>();

  isOpen: boolean = false; 
  filterText: string = ''; 
  filteredLanguages: string[] = [];
  isFocused = false;
  
  languages: string[] = [
      "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani",
      "Basque", "Belarusian", "Bengali", "Bosnian", "Bulgarian", 
      "Catalan", "Cebuano", "Chichewa", "Chinese (Simplified)", 
      "Chinese (Traditional)", "Corsican", "Croatian", "Czech", 
      "Danish", "Dutch", "English", "Esperanto", "Estonian", 
      "Filipino", "Finnish", "French", "Frisian", "Galician", 
      "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", 
      "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", 
      "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", 
      "Javanese", "Kannada", "Kazakh", "Khmer", "Kinyarwanda", "Korean", 
      "Kurdish (Kurmanji)", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", 
      "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese",
      "Maori", "Marathi", "Mongolian", "Myanmar (Burmese)", "Nepali", "Norwegian",
      "Odia (Oriya)", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Romanian",
      "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi", 
      "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", 
      "Swedish", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", 
      "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", 
      "Yoruba", "Zulu"
    ];     
        
    
  groupedLanguages: { [letter: string]: string[] } = {};

  constructor() {
    this.groupByLetter();
    this.filteredLanguages = this.languages;
    this.groupByLetter();
  }

  onLanguageSelected(lang: string) {
    this.selectedLanguage = lang;
    this.filterText = ""
    // this.filteredLanguages = this.languages;
    // this.groupByLetter();
    this.isOpen = false; 
    this.languageSelected.emit(lang);
  }


  private groupByLetter() {
    this.groupedLanguages = {};

    for (const lang of this.filteredLanguages) {
      const letter = lang.charAt(0).toUpperCase();

      if (!this.groupedLanguages[letter]) {
        this.groupedLanguages[letter] = [];
      }

      this.groupedLanguages[letter].push(lang);
    }
  }
  onLanguageChanged(lang: string) {
    this.selectedLanguage = lang;
    this.languageSelected.emit(lang);
  }


  onFocus() {
    this.isFocused = true;
    this.isOpen = true;
  }
  
  onBlur() {
    this.isFocused = false;
  }

  onFilterChange(value: string) {
    this.filterText = value.toLowerCase();
  
    this.filteredLanguages = this.languages.filter(lang =>
      lang.toLowerCase().includes(this.filterText)
    );
  
    this.groupByLetter(); 
  }
}