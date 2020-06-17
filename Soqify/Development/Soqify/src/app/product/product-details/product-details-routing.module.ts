import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDataPage } from './product-details.page';

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
export class ProductDetailsPageRoutingModule {}
