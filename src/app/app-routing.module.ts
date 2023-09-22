import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UebersichtComponent } from './component/uebersicht/uebersicht.component';

const routes: Routes = [
  { path: 'uebersicht', component: UebersichtComponent },
  { path: '', redirectTo:'uebersicht', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
