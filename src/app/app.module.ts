import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent, CompletedSearchComponent} from './app.component';
import { DialogComponent} from '../app/dialog/dialog.component';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';


import {MatDialogModule, MatTableDataSource, MatButtonModule, MatFormFieldModule, MatRippleModule,
MatTabsModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatChipsModule,
MatDatepickerModule, MatNativeDateModule, MatCardModule, MatGridListModule, MatDividerModule,
        MatListModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrordialogComponent } from './errorDialog/errordialog.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { TablestatsComponent } from './dialog/tablestats/tablestats.component';


@NgModule({
  declarations: [
    AppComponent,
    DialogComponent,
    ErrordialogComponent,
    TablestatsComponent,
    CompletedSearchComponent
  ],
  entryComponents: [DialogComponent, ErrordialogComponent, CompletedSearchComponent],
  imports: [
    BrowserModule,
    FormsModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    HttpClientModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatDividerModule,
    NgSelectModule,
    MatListModule,
    MatSnackBarModule,
    MatGridListModule,
    Ng4LoadingSpinnerModule.forRoot(),
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  exports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
  providers: [TranslateService],
  bootstrap: [AppComponent]

})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
      return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


platformBrowserDynamic().bootstrapModule(AppModule);
