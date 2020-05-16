import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModelPagePage } from './model-page.page';

const routes: Routes = [
  {
    path: '',
    component: ModelPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelPagePageRoutingModule {}
