import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { MainComponent } from './modules/main/main.component';
import { ClassComponent } from './modules/class/class.component';
import { ClassListComponent } from './modules/class-list/class-list.component';
import { ClassDetailComponent } from './modules/class-detail/class-detail.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'home', component: MainComponent,
    children: [
      { path: 'class', component: ClassComponent },
      { path: 'class-list/:id', component: ClassListComponent },
      { path: 'class-detail/:id', component: ClassDetailComponent },
    ]
  },
  { path: '404-notfound', component: AuthComponent },
  { path: '**', redirectTo: '404-notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
