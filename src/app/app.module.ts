import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthComponent } from './modules/auth/auth.component';
import { HeaderComponent } from './modules/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MainComponent } from './modules/main/main.component';
import { ClassComponent } from './modules/class/class.component';
import { ClassListComponent } from './modules/class-list/class-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { LoadingComponent } from './modules/loading/loading.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassDetailComponent } from './modules/class-detail/class-detail.component';
import { RegAdminComponent } from './modules/reg-admin/reg.component';
import { CreateOrDeleteDialog } from './modules/create-or-edit/create-or-edit.component';
import { ConfirmDeleteDialog } from './modules/confirm-delete/confirm-delete.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    MainComponent,
    ClassComponent,
    ClassListComponent,
    LoadingComponent,
    ClassDetailComponent,
    RegAdminComponent,
    CreateOrDeleteDialog,
    ConfirmDeleteDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
