import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SelectLanguageComponent } from './shared/select-language.component';

@Component({
  selector: 'app-languageTranslation',
  standalone: true,
  imports: [
    SelectLanguageComponent
  ],
  templateUrl: './languageTranslation.component.html',
  styleUrls: ['./languageTranslation.component.scss']
})
export class LanguageTranslationComponent implements OnInit {
  @Input() selectedLanguage: string = "English";
  @Output() languageSelected = new EventEmitter<string>();

  onLanguageChanged(lang: string) {
    this.selectedLanguage = lang;
    this.languageSelected.emit(lang);
  }

  constructor(private authService: AuthService) {
    this.authService.isVerifiedToAccess();
  }

  ngOnInit(): void {
  }
}

