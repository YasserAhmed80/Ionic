import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShoppingComponent } from './shopping/shopping.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'shopping',
    component: ShoppingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingSupplierRoutingModule { }
