import type { MediaFilter } from './MediaFilters';

export interface Alert {
  keywords_string: string;
  // mediaTypes: Array<any>;
  realTimeAlerts: string;
  boolean_search_string: string;
  mediaFilters: Map<string, MediaFilter>; // group id to filter
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  email: string;
  emails: string;
  numOfResults: number;
  formatEmail: boolean;
  formatDoc: boolean;
  formatExcel: boolean;
  formatPDF: boolean;
  formatHTML: boolean;
  digiViewType: boolean;
  digiViewAndAnalysis: boolean;
  textReport: boolean;
  textReportAnalysis: boolean;
  hitReport: boolean;
  hitReportAndAnalysis: boolean;
  positivePhrases: string;
  negativePhrases: string;
  phrases: string;
  idemailAlerts: number;
  alertId: string;
}
