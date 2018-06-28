
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Directive, Injector, ComponentFactoryResolver, Inject     } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatSpinner, MatSnackBar } from '@angular/material';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { latLng, Map, point, tileLayer,  marker, polyline, icon, FeatureGroup } from 'leaflet';
import { Observable } from 'rxjs';
import chroma from 'chroma-js';
import { DialogComponent} from '../app/dialog/dialog.component';
import { ErrordialogComponent } from './errorDialog/errordialog.component';
import { TranslateService } from '@ngx-translate/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: 'LoadingCompleted.html',
})
export class CompletedSearchComponent {}
declare const L: any;

// run with npm start
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  spinnerService: Ng4LoadingSpinnerService;

  map: Map;
  code: string;
  name: string;
  myFeatureGroup: FeatureGroup;
  scale: chroma;
  variable: string;
  scaleNum1: number;
  scaleNum3: number;
  scaleNum5: number;
  constructor(private http: HttpClient, public dialog: MatDialog, private translate: TranslateService,
     spinnerService: Ng4LoadingSpinnerService, public snackBar: MatSnackBar) {
      translate.setDefaultLang('es');
      translate.use('es');
      this.spinnerService = spinnerService;
  }

  onSubmit(form: NgForm) {
      // color scale
    if (form.value.variable === 'PRECIPITATION') {
      this.variable = 'pr';
      this.scale = chroma.scale(['#FFFFFF', '#90EE90', '#009FFF', '#6666FF', '#1306FF', '#9123FF',
                                '#6E00DB', '#5E00A6', '#410059']).domain([0, 30, 60, 90, 120, 150, 180, 210, 239]);
      this.scaleNum1 = 0;
      this.scaleNum3 = 120;
      this.scaleNum5 = 239;
    } else {
      this.variable = 'td';
      this.scale = chroma.scale(['#2E2E73', '#282898', '#201FBB', '#1A1ADC', '#3654DE', '#548EDC',
                                '#72CADE', '#6DD8DF', '#55CDE2', '#38BBDC', '#20B0DC', '#19BAA6', '#1CCE6A',
                                '#1BDF22', '#82C319', '#DCA819', '#DD921A', '#DE7C1A', '#DF671A',
                                '#DE501A', '#DD3819', '#DD2319', '#D21A1E', '#C31927', '#AD1A30', '#9A1A3B', '#871A44', '#871A44'])
                  .domain([-3, -1.5, 0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 13, 15.5, 18, 19.5, 21, 22.5, 24
                             , 25.5, 27, 29.5, 31, 32.5, 34, 36.5, 38, 39.5]);
      this.scaleNum1 = -3;
      this.scaleNum3 = 16.5;
      this.scaleNum5 = 39.5;
    }

    this.myFeatureGroup.clearLayers(); // borra marcadores para refrescar mapa
    let markerMap, name, valor, code;

    if ( form.value.variable.length === 0 ||  form.value.date.length === 0 ) {
      this.openErrorDialog(this, 'FormNotFilled', 'Fill the form');
    } else {
    this.spinnerService.show(); // begin load

    this.http.get<StationValue[]>('/rest/daily?variable=' + form.value.variable + '&date=' + form.value.date)
        .subscribe(response => {
            if (response.length === 0) {
               this.openErrorDialog(this, 'NoData', 'NoDataContent');
            }
            const self = this;
            for (let i = 0; i < response.length; i++) {
                  valor = response[i].value;
                  markerMap = L.circle([response[i].latitude, response[i].longitude ], {
                    color: this.scale(response[i].value).hex(),
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 150
                  }).on('click', function() {
                    name = response[i].name;
                    code = response[i].code;
                    self.openDialog(self, name, code);
                  }).addTo(this.myFeatureGroup);
            }
            this.snackBar.openFromComponent(CompletedSearchComponent, { duration: 1000, });
            this.spinnerService.hide(); // end load
        },
        err => {
          this.spinnerService.hide(); // end load
          this.openErrorDialog(this, 'ERROR', 'ResponseError');
      });


    }
  }



  groupClick(event) {

  }

  openDialog(self, name, code) {
      console.log('entra a abrir dialog: ' + self.dialog);
      this.name = name;
      this.code = code;
      const dialogRef = self.dialog.open(DialogComponent, { // open window of station details
            width: '80%',
            height: '92%',
            panelClass: 'custom-dialog-container',
            data: { code: this.code }
      });

      dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
      });

  }

 openErrorDialog(self, msgTitle, msgContent) {
      console.log('entra a abrir dialog: ' + self.dialog);
      const dialogRef = self.dialog.open(ErrordialogComponent, { // open window of error msg
            width: 'auto',
            height: 'auto',
            panelClass: 'custom-dialog-container',
            data: { title: msgTitle,
                    content: msgContent }
      });

      dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
      });

  }

  onMapReady(map: Map) {

  }
  ngOnInit(): void {
      // init map
      this.map = L.map('map', {
                 center: [40.4167,  -3.70325],
                 minZoom: 2,
                 zoom: 5,
      });
      L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
       this.myFeatureGroup = L.featureGroup().addTo(this.map);
  }

  onclickEsp() { // change language to Spanish
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  onclickEng() { // change language to English
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

}


export interface StationValue {
       code: string;
       name: string;
       longitude: number;
       latitude: number;
       altitude: number;
       value: number;
}

