import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import { FormComponent } from './core/components/form/form.component';
import {ReactiveFormsModule} from "@angular/forms";
import { SecondFormComponent } from './core/components/second-form/second-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    SecondFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
