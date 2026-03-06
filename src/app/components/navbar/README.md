# Navbar Component

This folder hosts the navigation bar introduced for the ASU\_ team refresh. It replaces the old `app.component.html` navbar with a configurable, Angular-based implementation.

## Highlights

- **Config driven:** Items are defined in `src/app/navigation/nav.config.ts`. Primary links stay on the top row; everything else goes into the dropdown menu.
- **Role aware:** Visibility rules (`all`, `authenticated`, `nonGuest`, `admin`, `nonAdmin`) keep links in sync with `AuthService` state.
- **Active state & reload:** Links auto-highlight via `routerLinkActive`. Items can set `reloadOnSameRoute` to refresh the current page when clicked again (e.g. Search).
- **Responsive UX:** The dropdown uses a multicolumn layout on wide screens, collapses under the menu toggle on small viewports, and keeps the user menu separate.
- **User profile chip:** The “BO” badge comes from the authenticated user’s email initials and opens a mini menu with the `Sign out` action.
- **Google Translate support:** Hidden containers maintain the IDs that `index.html` expects when wiring Google Translate.

## Files

| File                                       | Purpose                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `navbar.component.ts`                      | Component logic: state for menu/dropdown, auth helpers, active-reload handling. |
| `navbar.component.html`                    | Template: brand, primary links, dropdown, user menu, translate containers.      |
| `navbar.component.scss`                    | Styling: spacing, typography, multicolumn dropdown, user chip.                  |
| `nav.config.ts` (in `src/app/navigation/`) | Central configuration for navigation items and visibility rules.                |

## Updating the Menu

1. Edit `NAV_CONFIG.primary` for top-level items. Keep the primary set short so it fits comfortably across the navbar.
2. Add secondary items to `NAV_CONFIG.secondary`. They render inside the dropdown and support additional metadata (`visibility`, `reloadOnSameRoute`, `id` for DOM hooks).
3. If a new route should be restricted, add the proper `visibility` flag and ensure the route’s guards reflect the same logic.
4. Restart the dev server (`npm start`) if you modify routes or guards so Angular picks up the changes.

## Extending

- To add icons or badges, expose extra properties in `NavItem` and update the template.
- For more complex role logic, adjust `NavbarComponent.isVisible` or extend `NavItemVisibility` with new tokens.
- If you need persistent notification counts, wire in a service and inject it into the component—`NavbarComponent` is a non-standalone Angular component declared in `AppModule`.

## Cleanup Notes

The legacy markup in `app.component.html` was removed in favor of `<app-navbar>`. Any remaining unused helper functions (e.g., old `navigateTo*` methods) should live in the navbar or be deleted once confirm no other components depend on them. Whenever additional links are requested, prefer editing the config rather than the template directly to keep navigation consistent.
