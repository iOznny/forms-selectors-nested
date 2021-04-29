import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { SelectorComponent } from './pages/selector/selector.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'selector', component: SelectorComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'selector'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CountriesRoutingModule { }
