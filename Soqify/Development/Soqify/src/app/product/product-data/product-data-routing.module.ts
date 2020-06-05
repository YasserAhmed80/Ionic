import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDataPage } from './product-data.page';

const routes: Routes = [
  {
    path: '',
    component: ProductDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDataPageRoutingModule {}
