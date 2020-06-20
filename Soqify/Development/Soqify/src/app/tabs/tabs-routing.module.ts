import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'login',
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../shopping-supplier/shopping-supplier.module').then(m => m.ShoppingSupplierModule)
      },
      {
        path: '',
        redirectTo: '/tabs/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
