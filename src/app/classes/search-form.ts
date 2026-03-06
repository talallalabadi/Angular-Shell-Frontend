export class SearchForm {

  // language
  language = 'English';

  // search strings
  keywords_string = '';
  or_search_string = '';
  not_search_string = '';

  // media type
  media = 'All';
  mediaTypeTelevision = false;
  mediaTypeNewspaper = false;
  mediaTypeRadio = false;
  mediaTypeMagazine = false;

  // location
  country = 'All';
  stateProv = 'All';
  city = 'All';

  denverTelevision = 'All';
  newspaperSelection = 'All';
  radioSelection = 'All';
  magazineSelection = 'All';
  socialMediaSelection = 'All';

  startDate = '';
  endDate = '';
  startTime = '';
  endTime = '';
  emails = '';

  // result formats
  numOfResults = '10';  // default 10?
  realTimeAlerts = '';

  // report format
  formatEmail = false;
  formatDoc = false;
  formatExcel = false;
  formatPDF = false;
  formatHTML = false;

  // type of report
  digiViewType = false;
  digiViewAndAnalysis = false;
  textReport = false;
  textReportAnalysis = false;
  hitReport = false;
  hitReportAndAnalysis = false;

  // phrases
  positivePhrases = '';
  negativePhrases = '';
  phrases = '';

  //TODO: ADD SELECTED LANGUAGE HERE

}
