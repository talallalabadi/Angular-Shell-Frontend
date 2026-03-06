import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StubComponent } from './components/stub/stub.component';

const routes: Routes = [
  { path: '', component: StubComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingDevBModule {}
