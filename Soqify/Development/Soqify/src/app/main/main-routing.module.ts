import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'shopping',
        loadChildren: () => import('../shopping-supplier/shopping-supplier.module').then(m => m.ShoppingSupplierModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then(m => m.CartModule)
      },
      {
        path: '',
        redirectTo: '/main/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
