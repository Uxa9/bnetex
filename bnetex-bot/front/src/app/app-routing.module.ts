import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PairsComponent } from './pages/pairs/pairs.component';
import { ActiveGroupsComponent } from './pages/patterns/active-groups/active-groups.component';
import { PatternsComponent } from './pages/patterns/patterns.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/patterns' },  
  { path: 'pairs', component: PairsComponent },
  {
    path: 'pairs/:PAIR/patterns',
    component: PatternsComponent
  },
  {
    path: 'pairs/:PAIR/patterns/activeGroups/:AGID',
    component: ActiveGroupsComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
