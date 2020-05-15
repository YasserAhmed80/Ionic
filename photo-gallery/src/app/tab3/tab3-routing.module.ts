import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page,
    children: [
      {
        path: 'action-sheet',
        loadChildren: () => import('../action-sheet/action-sheet.module').then( m => m.ActionSheetPageModule)
      },
      {
        path: 'card',
        loadChildren: () => import('../card/card.module').then( m => m.CardPageModule)
      },
      {
        path: 'chip',
        loadChildren: () => import('../chip/chip.module').then( m => m.ChipPageModule)
      },
      {
        path: 'date',
        loadChildren: () => import('../date/date.module').then( m => m.DatePageModule)
      },
      {
        path: 'fab',
        loadChildren: () => import('../fab/fab.module').then( m => m.FabPageModule)
      },
      {
        path: '',
        redirectTo: 'fab',
        pathMatch: 'full'
      }
    ]
  },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule {}
