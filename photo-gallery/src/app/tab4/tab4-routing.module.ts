import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4Page } from './tab4.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page
  },
  {
    path: 'skeleton',
    loadChildren: () => import('../skeleton/skeleton.module').then( m => m.SkeletonPageModule)
  },
  {
    path: 'slide',
    loadChildren: () => import('../slide/slide.module').then( m => m.SlidePageModule)
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4PageRoutingModule {}
