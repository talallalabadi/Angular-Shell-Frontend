// LEGACY/UNUSED: This file is deprecated. The active router module is
// `src/app/app-routing/app-routing.module.ts`. The `ad-debug` route has
// been consolidated there. This module is intentionally inert.
import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModuleLegacy {}
