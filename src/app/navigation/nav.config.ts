/**
 * Defines the structure of the global navigation bar.
 *
 * The configuration separates items that should be pinned to the
 * top-level row (`primary`) from those that belong in the overflow
 * dropdown (`secondary`).  Each {@link NavItem} can constrain its
 * visibility based on authentication state and hold metadata that
 * helps drive the navbar UI (e.g. whether the current route should
 * reload when reselected).
 */
export type NavItemVisibility = 'all' | 'authenticated' | 'nonGuest' | 'admin' | 'nonAdmin';

export interface NavItem {
  /** Display text for the navigation link */
  label: string;
  /** Router link to navigate to. Use placeholder routes for pages that do not yet exist. */
  route?: string;
  /** Optional DOM id hook for programmatic integrations (e.g. Google Translate). */
  id?: string;
  /** Whether the current route should refresh when the link is reselected. */
  reloadOnSameRoute?: boolean;
  /** Restricts visibility to a subset of users. Defaults to `all`. */
  visibility?: NavItemVisibility;
  /** Nested items appear inside the overflow dropdown. */
  children?: NavItem[];
}

export interface NavigationConfig {
  /** Items shown on the top-level navigation row. */
  primary: NavItem[];
  /** Label used for the overflow dropdown that holds remaining items. */
  secondaryLabel: string;
  /** Items rendered inside the overflow dropdown. */
  secondary: NavItem[];
}

export const NAV_CONFIG: NavigationConfig = {
  primary: [
    {
      label: 'Search',
      route: '/search',
      reloadOnSameRoute: true,
    },
    {
      label: 'Media Analytics',
      route: '/mediaAnalytics',
      visibility: 'nonGuest',
      reloadOnSameRoute: true,
    },
    {
      label: 'Contact Us',
      route: '/contactUs',
    },
  ],
  secondaryLabel: 'Menu',
  secondary: [
    {
      label: 'Email Alerts',
      route: '/alerts',
      visibility: 'nonGuest',
      reloadOnSameRoute: true,
    },
    {
      label: 'Media Transfer',
      route: '/mediaTransfer',
      reloadOnSameRoute: true,
    },
    {
      label: 'Language Translation',
      route: '/languageTranslation',
      id: 'translation-placeholder',
      visibility: 'nonGuest',
    },
    {
      label: 'Customize Logo',
      route: '/customizeLogo',
      visibility: 'admin',
    },
    {
      label: 'Add Newspaper',
      route: '/addNews',
      visibility: 'admin',
    },
    {
      label: 'Add Magazine',
      route: '/addMags',
      visibility: 'admin',
    },
    {
      label: 'Add Radio Station',
      route: '/addRads',
      visibility: 'admin',
    },
    {
      label: 'Help',
      route: '/helpPage',
      reloadOnSameRoute: true,
    },
    {
      label: 'Survey',
      route: '/survey',
      reloadOnSameRoute: true,
    },
    {
      label: 'DigiChat',
      route: '/digichat',
      reloadOnSameRoute: true,
    },
  ],
};


