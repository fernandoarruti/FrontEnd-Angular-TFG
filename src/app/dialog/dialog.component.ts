// selector de meses, eje x anos, eje y temps & prec

import { ErrordialogComponent } from '../errorDialog/errordialog.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator,
         PageEvent, MatTabChangeEvent, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as Plotly from 'plotly.js';
import { Observable } from 'rxjs';
declare var System: System;
interface System {
  import(request: string): Promise<any>;
}


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})


export class DialogComponent implements OnInit {
  translate: TranslateService;
  dialogEmptyResponse: MatDialogRef<ErrordialogComponent>;
  code: string;
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  provider: string;
  startDate: string;
  endDate: string;
  monthTabActive: string;
  seasonTabActive: string;
  totalTabActive: string;
  dailyTabActive: string;
  yearTabActive: string;
  missingNumber: number;
  colorTempMax = '0';
  colorTempMean = '0';
  colorTempMin = '0';
  colorPr = '0';
  color: string;
  selectedMonth: any;
  selectedDay: any;
  selectedSeason: any;
  selectedYear: any;
  years = [];
  loadingTable = true;
  loadingSpinner = false;
  precipitations = [];
  temperaturesMin = [];
  temperaturesMax = [];
  temperaturesMean = [];
  disabled = true;
  year: number;
  monthlyTableMaximumValues: MatTableDataSource<RankValue>;
  monthlyTableMinimumValues: MatTableDataSource<RankValue>;
  totalTableMaximumValues: MatTableDataSource<RankValue>;
  totalTableMinimumValues: MatTableDataSource<RankValue>;
  seasonTableMaximumValues: MatTableDataSource<RankSeasonValue>;
  seasonTableMinimumValues: MatTableDataSource<RankSeasonValue>;
  tableSeasonMaximumValues: MatTableDataSource<RankValue>;
  tableSeasonMinimumValues: MatTableDataSource<RankValue>;
  yearTableMaximumValues: MatTableDataSource<RankValue>;
  yearTableMinimumValues: MatTableDataSource<RankValue>;
  dailyTableMaximumValues: MatTableDataSource<RankValue>;
  dailyTableMinimumValues: MatTableDataSource<RankValue>;
  displayedColumns = ['type', 'position', 'date', 'value'];
  precipitationsMonthlyYear = [];
  temperaturesMinMonthlyYear = [];
  temperaturesMaxMonthlyYear = [];
  temperaturesMeanMonthlyYear = [];

levels: Array<Object> = [
      {num: 0, name: 'AA'},
      {num: 1, name: 'BB'}
  ];
  selectedLevel;
  levelNum: number;

  pageEvent: PageEvent;

  initialDateGraph: string;
  endlyDateGraph: string;
  selectedMonthNames: string[];
  @ViewChild('chart') el: ElementRef; // ploty
  @ViewChild(MatPaginator) paginator: MatPaginator; // selector num elementa

  arrayMonthAndYear = [];
  months = [];
  monthSelectorArray = [];
  daysOfMonth = [];
  seasonsEng = [
     'Winter',
     'Spring',
     'Summer',
     'Autumn'
  ];
  seasonsSelectorArray = [];
  monthsEng = [
        'January',
        'February',
        'March',
        'April',
         'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
        'Year'
  ];


  ngOnInit(): void {
  }

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any , translate: TranslateService, public dialog: MatDialog) {
          this.translate = translate;
          this.getData();
          for (let i = 0; i < this.monthsEng.length ; i++) {
                translate.get(this.monthsEng[i]).subscribe((res: string) => {
                   this.arrayMonthAndYear.push({id: i, name: res, engName : this.monthsEng[i]});
                 });
          }

          for (let i = 0; i < this.monthsEng.length - 1 ; i++) {
                translate.get(this.monthsEng[i]).subscribe((res: string) => {
                  let numberDays;
                  if ( i === 0 || i === 2 || i === 4 || i === 6 || i === 7 || i === 9 || i === 11 ) {
                    numberDays = 31;
                  } else if ( i === 1) {
                    numberDays = 29;
                  } else {
                    numberDays = 30;
                  }
                  this.monthSelectorArray.push({id: i, name: res, engName : this.monthsEng[i], numberDays: numberDays});
                 });
          }
          for (let i = 0; i < this.seasonsEng.length ; i++) {
            translate.get(this.seasonsEng[i]).subscribe((res: string) => {
                      this.seasonsSelectorArray.push({id: i, name: res, engName: this.seasonsEng[i]});
            });
          }

          for ( let i = 0; i < 31; i++) {
                this.daysOfMonth.push(i + 1);
          }
   }

  getData(): void {
     this.http.get<StationData>('/rest/getStationData?code=' + this.data.code)
        .subscribe(response => {
                   this.name = response.name;
                   this.code = response.code;
                   this.longitude = response.longitude;
                   this.latitude = response.latitude;
                   this.altitude = response.altitude;
                   this.provider = response.provider;
                   const iniYear = Number(response.startDate.substring(0, 4));
                   const endYear = Number(response.endDate.substring(0, 4));

                   for ( let i = iniYear ;  i <= endYear ; i++) { // years in range
                         this.years.push(i);
                   }
                   if ( this.translate.currentLang === 'en') {
                    this.startDate = response.startDate.substr(5, 2) + '-' + response.startDate.substr(8, 2) + '-' +
                       response.startDate.substr(0, 4);
                     this.endDate = response.endDate.substr(5, 2) + '-' + response.endDate.substr(8, 2) + '-' +
                       response.endDate.substr(0, 4);
                   } else {
                     this.startDate = response.startDate.substr(8, 2) + '-' + response.startDate.substr(5, 2) + '-' +
                       response.startDate.substr(0, 4);
                     this.endDate = response.endDate.substr(8, 2) + '-' + response.endDate.substr(5, 2) + '-' +
                       response.endDate.substr(0, 4);
                   }
                   this.missingNumber = Math.round(response.missingNumber * 100) / 100;
                   if (response.temperatureMax === 1) {
                       this.colorTempMax = '1';
                   }
                   if (response.temperatureMed === 1) {
                       this.colorTempMean = '1';
                   }
                    if (response.temperatureMin === 1) {
                       this.colorTempMin = '1';
                   }
                   if (response.precipitation === 1) {
                       this.colorPr = '1';
                   }
      },
        err => {
          this.openDialog(this, 'ERROR', 'ResponseError');
      });
  }

  /**
   * Function called when a date is introduced, only executed when 2 dates are introduced
   */
  makeHistogram(form: NgForm): void {
    if ( form.value.dateIni !== '' && form.value.dateEnd !== '') {
          if (form.value.dateIni > form.value.dateEnd) {
             this.openDialog(this, 'Error', 'BadDates');
          } else {
          this.initialDateGraph = form.value.dateIni;
          this.endlyDateGraph = form.value.dateEnd;
          const monthlyGraph = document.getElementById('montlyHistogram');
          const yearlyGraphic = document.getElementById('yearlyHistogram');
          if ( document.body.contains(monthlyGraph)) {
                this.getAxisYearlyHistogram(form.value.dateIni, form.value.dateEnd, this.data.code);
          } else if ( document.body.contains(yearlyGraphic) && this.selectedMonthNames != null ) {
             this.getAxisMonthlyHistogram( this.initialDateGraph, this.endlyDateGraph , this.code);
          }
      }
    }
  }
  /**
   * Function called when months are introduced in the form
   */
  makeMonthlyDataGrafic(form: NgForm): void {
        if (this.selectedMonthNames.length > 0 && (this.initialDateGraph == null ||  this.endlyDateGraph == null)) {
            this.openDialog(this, 'Error', 'IntroduceDates');
        }

        if ( this.selectedMonthNames.length > 0 && this.initialDateGraph != null &&  this.endlyDateGraph != null) {
              for ( let i = 0 ; i < this.selectedMonthNames.length; i++) {
                  if ( this.selectedMonthNames[i] === this.monthsEng[12]) {
                       this.selectedMonthNames.length = 0;
                  }
              }
              this.getAxisMonthlyHistogram( this.initialDateGraph, this.endlyDateGraph , this.code);
        }
  }
  /**
   * Close the dialog when click outside
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /**
   * Get values for the yearly graphic
   */
  getAxisMonthlyHistogram(iniDate, endDate, code) {
    if (this.initialDateGraph !== '' && this.endlyDateGraph !== '') {

    const promise = new Promise((resolve, reject) => {
     this.http.get<MonthlyValueYear[]>('/rest/readValuesOfMonths?months=' + this.selectedMonthNames.toString() +
     '&stationName=' + this.code + '&startDate=' + iniDate + '&endDate=' + endDate)
        .toPromise().then(response => {
         if ( response.length === 0) {
            Plotly.purge('yearlyHistogram');
            this.openDialog(this, 'NoData', 'NoDataContent');
         } else {
            this.makeMonthlyGraphic(response);
            resolve();
         }
       },
        err => {
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
    );
    });
      return  promise;
    }

  }
  /**
   * Get values for the histogram
   */
  getAxisYearlyHistogram(iniDate, endDate, code) {
    const promise = new Promise((resolve, reject) => {
     this.http.get<MonthlyValue[]>('/rest/getValuesBetween?stationName='
      + code + '&startDate=' + iniDate + '&endDate=' + endDate)
        .toPromise().then(response => {
          if ( response.length === 0) {
            Plotly.purge('montlyHistogram');
            this.openDialog(this, 'NoData', 'NoDataContent');
          } else {
            this.makeGraphic(response);
          }
         resolve();
       },
        err => {
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
    );
    });
  }
  /**
   * Make the year graphic
   */
  makeMonthlyGraphic(response) {
     this.precipitations.length = 0;
     this.temperaturesMax.length = 0;
     this.temperaturesMin.length = 0;
     this.temperaturesMean.length = 0;
     this.precipitationsMonthlyYear.length = 0;
     this.temperaturesMeanMonthlyYear.length = 0;
     this.temperaturesMinMonthlyYear.length = 0;
     this.temperaturesMaxMonthlyYear.length = 0;
     for (let i = 0; i < response.length; i++) {
              if (response[i].variable === 'PRECIPITATION') {
                   this.precipitations.push(response[i].value);
                   this.precipitationsMonthlyYear.push(response[i].year);
                   console.log('Anho: ' + response[i].year + ', valor: ' + response[i].value);
              }
              if ( response[i].variable === 'TEMPERATURE_MAX') {
                   this.temperaturesMax.push(response[i].value);
                   this.temperaturesMaxMonthlyYear.push(response[i].year);
              }
              if ( response[i].variable === 'TEMPERATURE_MIN') {
                   this.temperaturesMin.push(response[i].value);
                   this.temperaturesMinMonthlyYear.push(response[i].year);
              }
              if (response[i].variable === 'TEMPERATURE_MEAN') {
                   this.temperaturesMean.push(response[i].value);
                   this.temperaturesMeanMonthlyYear.push(response[i].year);
              }
     }
     let tmax;
       this.translate.get('Maximum Temperature').subscribe((res: string) => {
         tmax = res;
      });
    const dataTmax = {
        x: this.temperaturesMaxMonthlyYear,
        y: this.temperaturesMax,
        name: tmax,
        type: 'scatter',
        yaxis: 'y2'
    };
    let tmin;
       this.translate.get('Minimum Temperature').subscribe((res: string) => {
         tmin = res;
      });
    const dataTmin = {
        x: this.temperaturesMinMonthlyYear,
        y: this.temperaturesMin,
        name: tmin,
        type: 'scatter',
        yaxis: 'y2'
    };
    let tmean;
       this.translate.get('Mean Temperature').subscribe((res: string) => {
         tmean = res;
      });
    const dataTmean = {
        x: this.temperaturesMeanMonthlyYear,
        y: this.temperaturesMean,
        name: tmean,
        type: 'scatter',
        yaxis: 'y2'
    };
    let pr;
       this.translate.get('Precipitation').subscribe((res: string) => {
         pr = res;
      });
    const dataPr = {
        x: this.precipitationsMonthlyYear,
        y: this.precipitations,
        name: pr,
        type: 'bar'
    };


    const data = [dataPr, dataTmean, dataTmin, dataTmax];
    let title;
       this.translate.get('Yearly histogram').subscribe((res: string) => {
         title = res;
      });
    let yAxistitle;
       this.translate.get('Precipitations').subscribe((res: string) => {
         yAxistitle = res;
      });
    let yAxis2title;
       this.translate.get('Temperatures').subscribe((res: string) => {
         yAxis2title = res;
      });
    const layout = {
        title: title,
        yaxis: {
          title: yAxistitle,
          titlefont: {color: '#1f77b4'},
          tickfont: {color: '#1f77b4'}
        },
        yaxis2: {
          title: yAxis2title,
          titlefont: {color: '#ff0000'},
          tickfont: {color: '#ff7f0e'},
          anchor: 'x',
          overlaying: 'y',
          side: 'right',
        }
    };
    // [trace1, trace2]     [dataPr, dataTmean, dataTmin, dataTmax] [dataTmax, dataTmin]

    Plotly.purge('yearlyHistogram'); // refresh in case graphic exist
    Plotly.plot( 'yearlyHistogram', data, layout);
  }

  makeGraphic(response) {
      this.precipitations.length = 0;
      this.temperaturesMax.length = 0;
      this.temperaturesMin.length = 0;
      this.temperaturesMean.length = 0;
      for (let i = 0; i < response.length; i++) {
              if (response[i].variable === 'PRECIPITATION') {
                   this.precipitations.push(response[i].value);
              }
              if ( response[i].variable === 'TEMPERATURE_MAX') {
                   this.temperaturesMax.push(response[i].value);
              }
              if ( response[i].variable === 'TEMPERATURE_MIN') {
                   this.temperaturesMin.push(response[i].value);
              }
              if (response[i].variable === 'TEMPERATURE_MEAN') {
                   this.temperaturesMean.push(response[i].value);
              }
     }
     for (let i = 0; i < this.arrayMonthAndYear.length; i++) {
        this.months.push(this.arrayMonthAndYear[i].name);
      }

      let tmax;
       this.translate.get('Minimum Temperature').subscribe((res: string) => {
         tmax = res;
      });
      const dataTmax = {
          x:  this.months,
          y: this.temperaturesMax,
          name: tmax,
          type: 'scatter',
          yaxis: 'y2'
      };
     let tmin;
       this.translate.get('Minimum Temperature').subscribe((res: string) => {
         tmin = res;
      });
      const dataTmin = {
          x:  this.months,
          y: this.temperaturesMin,
          name: tmin,
          type: 'scatter',
          yaxis: 'y2'
      };

     let tmean;
       this.translate.get('Mean Temperature').subscribe((res: string) => {
         tmean = res;
      });
      const dataTmean = {
          x:  this.months,
          y: this.temperaturesMean,
          name: tmean,
          type: 'scatter',
          yaxis: 'y2'
      };
    let pr;
       this.translate.get('Precipitation').subscribe((res: string) => {
         pr = res;
      });
      const dataPr = {
          x:  this.months,
          y: this.precipitations,
          name: pr,
          type: 'bar'
      };

      const data = [dataPr, dataTmean, dataTmin, dataTmax];
      let title;
       this.translate.get('Monthly histogram').subscribe((res: string) => {
         title = res;
      });
     let yAxistitle;
       this.translate.get('Precipitations').subscribe((res: string) => {
         yAxistitle = res;
      });
    let yAxis2title;
       this.translate.get('Temperatures').subscribe((res: string) => {
         yAxis2title = res;
      });
      const layout = {
          title: title ,
          yaxis: {
              title: yAxistitle,
              titlefont: {color: '#1f77b4'},
              tickfont: {color: '#1f77b4'}
          },
          yaxis2: {
              title: yAxis2title,
              titlefont: {color: '#ff0000'},
              tickfont: {color: '#ff7f0e'},
              anchor: 'x',
              overlaying: 'y',
              side: 'right',
          }
      };

      Plotly.purge('montlyHistogram'); // refresh in case graphic exist
      Plotly.plot( 'montlyHistogram', data, layout);
   }

  makeTableOfSelectedMonth() {
      if ( this.monthTabActive == null) { // initial case
        this.monthTabActive = 'TEMPERATURE_MAX';
      }
      if ( this.selectedMonth == null) {
          this.openDialog(this, 'Introduce month', 'Introduce month content');
      } else {
          this.loadingSpinner = true;
          this.loadingTable = true;
          let month;
          this.translate.get(this.selectedMonth).subscribe((res: string) => {
                month = res;
          });
          const promise = new Promise((resolve, reject) => {
          this.http.get<RankMonthValue[]>('/rest/readTopStatisticsOfMonth?months=' + this.selectedMonth +
                              '&stationCode=' + this.code + '&startDate=1949-01-01&endDate=2015-12-31&n=3&variable=' + this.monthTabActive)
          .toPromise().then(response => {
              if (response.length === 0) {
                  this.openDialog(this, 'NoData', 'NoDataContent');
                  this.loadingSpinner = false;
              } else {
                  const values =  [];
                  for ( let i = 0 ; i < response.length; i++) {
                      const rankVal = { type: response[i].type , position: response[i].position,
                      date: month + ' ' + response[i].year, value: response[i].value };
                      values.push(rankVal);
                  }

                  this.loadingTable = false;
                  this.loadingSpinner = false;
                  this.monthlyTableMaximumValues = new MatTableDataSource(values.filter(res => res.type === 'TOP3'));
                  this.monthlyTableMinimumValues = new MatTableDataSource(values.filter(res => res.type === 'BOTTOM3'));
              }
           },
        err => {
          this.loadingSpinner = false;
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
          );
          });
      }
  }

  makeTableOfSelectedSeason() {
        if ( this.seasonTabActive == null) { // initial case
             this.seasonTabActive = 'TEMPERATURE_MAX';
        }
        // display 3 items by default
        if ( this.selectedSeason == null) {
             this.openDialog(this, 'Introduce season', 'Introduce season content');
        } else {
             this.loadingSpinner = true;
             this.loadingTable = true;
             let season;
             this.translate.get(this.seasonsEng[this.selectedSeason]).subscribe((res: string) => {
                season = res;
             });
             const promise = new Promise((resolve, reject) => {
             this.http.get<RankSeasonValue[]>('/rest/readStatisticsOfSeason?season=' +
               this.seasonsEng[this.selectedSeason] + '&stationCode=' + this.code + '&n=3&variable=' + this.seasonTabActive)
             .toPromise().then(response => {
                 if (response.length === 0) {
                     this.openDialog(this, 'NoData', 'NoDataContent');
                     this.loadingSpinner = false;
                 } else {
                     const values =  [];
                     for ( let i = 0 ; i < response.length; i++) {
                           const rankVal = { type: response[i].type , position: response[i].position,
                           date: season + ' ' + response[i].year, value: response[i].value };
                           values.push(rankVal);
                     }
                     this.loadingTable = false;
                     this.loadingSpinner = false;
                     this.seasonTableMaximumValues = new MatTableDataSource(values.filter(res => res.type === 'TOP3'));
                     this.seasonTableMinimumValues = new MatTableDataSource(values.filter(res => res.type === 'BOTTOM3'));
                 }
             },
        err => {
          this.loadingSpinner = false;
          this.openDialog(this, 'ERROR', 'ResponseError');
      });
        });
        }
  }

  makeTableOfTotalValues() {
          if ( this.totalTabActive == null) { // initial case
             this.totalTabActive = 'TEMPERATURE_MAX';
          }
          this.loadingSpinner = true;
          this.loadingTable = true;
           const promise = new Promise((resolve, reject) => {
           this.http.get<RankValue[]>('/rest/readTotalStatistics?&stationCode='
             + this.code + '&startDate=1950-01-01&endDate=2015-12-31&n=3&variable=' + this.totalTabActive)
           .toPromise().then(response => {
                    this.loadingTable = false;
                    this.loadingSpinner = false;
                    this.totalTableMaximumValues = new MatTableDataSource(response.filter(res => res.type === 'TOP3'));
                    this.totalTableMinimumValues = new MatTableDataSource(response.filter(res => res.type === 'BOTTOM3'));

       },
        err => {
          this.loadingSpinner = false;
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
    );
    });
  }

/**
 * Function activated when tab changes
 */
  mainTabChange(event: MatTabChangeEvent) {
    if ( this.initialDateGraph != null && this.endlyDateGraph != null &&  event.index === 0) { // tab 1
        this.getAxisYearlyHistogram(this.initialDateGraph, this.endlyDateGraph, this.data.code);
    }
    if ( this.initialDateGraph != null && this.endlyDateGraph != null &&  event.index === 1 &&  this.selectedMonthNames != null ) {
        this.getAxisMonthlyHistogram(this.initialDateGraph, this.endDate, this.code);
    }


  }



  changeMonthlyTab(event: MatTabChangeEvent) {
    this.loadingTable = true;
    if (event.index === 1) {
       this.monthTabActive = 'TEMPERATURE_MEAN';
      this.makeTableOfSelectedMonth();

    } else if (event.index === 2) {
      this.monthTabActive = 'TEMPERATURE_MIN';
      this.makeTableOfSelectedMonth();

    } else if (event.index === 3) {
      this.monthTabActive = 'PRECIPITATION';
      this.makeTableOfSelectedMonth();

    } else {
      this.monthTabActive = 'TEMPERATURE_MAX';
      this.makeTableOfSelectedMonth();

    }

  }
  changeSeasonTab(event: MatTabChangeEvent) {
    this.loadingTable = true;
    if (event.index === 1) {
       this.seasonTabActive = 'TEMPERATURE_MEAN';
       this.makeTableOfSelectedSeason();
    } else if (event.index === 2) {
      this.seasonTabActive = 'TEMPERATURE_MIN';
      this.makeTableOfSelectedSeason();
    } else if (event.index === 3) {
      this.seasonTabActive = 'PRECIPITATION';
      this.makeTableOfSelectedSeason();
    } else if (event.index === 0) {
      this.seasonTabActive = 'TEMPERATURE_MAX';
      this.makeTableOfSelectedSeason();
    }
  }

  changeTotalTab(event: MatTabChangeEvent) {
    if (event.index === 1) {
       this.totalTabActive = 'TEMPERATURE_MEAN';
       this.makeTableOfTotalValues();
    } else if (event.index === 2) {
      this.totalTabActive = 'TEMPERATURE_MIN';
      this.makeTableOfTotalValues();

    } else if (event.index === 3) {
      this.totalTabActive = 'PRECIPITATION';
      this.makeTableOfTotalValues();

    } else if (event.index === 0) {
      this.totalTabActive = 'TEMPERATURE_MAX';
      this.makeTableOfTotalValues();

    }
  }
/**
 * Function activated when the second tab changes
 */
  secondaryTabChange(event: MatTabChangeEvent) {
    this.loadingTable = true;
    if (  event.index === 2) { // tab 3, only do action when total values are activated, others required enter values
         this.makeTableOfTotalValues();
    }
  }
  changeDailyTab(event: MatTabChangeEvent) {
    this.loadingTable = true;
    if (event.index === 1) {
       this.dailyTabActive = 'TEMPERATURE_MEAN';
       this.getDailyTable();
    } else if (event.index === 2) {
      this.dailyTabActive = 'TEMPERATURE_MIN';
      this.getDailyTable();

    } else if (event.index === 3) {
      this.dailyTabActive = 'PRECIPITATION';
      this.getDailyTable();

    } else {
      this.dailyTabActive = 'TEMPERATURE_MAX';
      this.getDailyTable();

    }
  }


  changeYearTab(event: MatTabChangeEvent) {
    this.loadingTable = true;
    if (event.index === 1) {
       this.yearTabActive = 'TEMPERATURE_MEAN';
       this.getYearTable();
    } else if (event.index === 2) {
      this.yearTabActive = 'TEMPERATURE_MIN';
      this.getYearTable();

    } else if (event.index === 3) {
      this.yearTabActive = 'PRECIPITATION';
      this.getYearTable();

    } else {
      this.yearTabActive = 'TEMPERATURE_MAX';
      this.getYearTable();

    }
  }

   getYearTable() {

      if ( this.yearTabActive == null) { // initial case
             this.yearTabActive = 'TEMPERATURE_MAX';
       }
         this.loadingSpinner = true;
          this.loadingTable = true;
    const promise = new Promise((resolve, reject) => {
     this.http.get<RankValue[]>('/rest/readTopStatisticsOfYear?year=' + this.selectedYear + '&stationCode=' +
       this.code + '&n=3&variable=' + this.yearTabActive)
        .toPromise().then(response => {
            if (response.length === 0) {
                this.openDialog(this, 'NoData', 'NoDataContent');
                this.loadingSpinner = false;
            } else {
                this.loadingTable = false;
                this.loadingSpinner = false;
                this.yearTableMaximumValues = new MatTableDataSource(response.filter(res => res.type === 'TOP3'));
                this.yearTableMinimumValues = new MatTableDataSource(response.filter(res => res.type === 'BOTTOM3'));
            }
       },
        err => {
          this.loadingSpinner = false;
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
    );
    });


  }


  getDailyTable() {
    if ( this.selectedMonth != null) {
      this.daysOfMonth.length = 0;
      for ( let i = 0; i < this.selectedMonth.numberDays; i++) {
                this.daysOfMonth.push(i + 1);
        }
    }
    if ( this.selectedMonth != null && this.selectedDay == null) {
      this.disabled = false;
    }

    if ( this.dailyTabActive == null) { // initial case
             this.dailyTabActive = 'TEMPERATURE_MAX';
    }

    // call to the service
    if ( this.selectedDay != null && this.selectedMonth != null) {
        this.loadingSpinner = true;
        this.loadingTable = true;
        const month = this.selectedMonth.id + 1;
        this.http.get<RankValue[]>('/rest/readTopStatisticsOfDay?day=' + this.selectedDay +
          '&month=' + month + '&stationCode=1109&n=3&variable=' + this.dailyTabActive)
          .toPromise().then(response => {
           if (response.length === 0) {
                this.openDialog(this, 'NoData', 'NoDataContent');
                this.loadingSpinner = false;
            } else {
                this.loadingTable = false;
                this.loadingSpinner = false;
                this.dailyTableMaximumValues = new MatTableDataSource(response.filter(res => res.type === 'TOP3'));
                this.dailyTableMinimumValues = new MatTableDataSource(response.filter(res => res.type === 'BOTTOM3'));
            }
       },
        err => {
          this.loadingSpinner = false;
          this.openDialog(this, 'ERROR', 'ResponseError');
      }
    );
    }

  }

  openDialog(self, msgTitle, msgContent) {
      const dialogRef = self.dialog.open(ErrordialogComponent, { // abre ventana emergente con detalles estacion
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
}





export interface MonthlyValue {
       monthName: string;
       value: number;
       variable: string;
}

export interface RankValue {
       stationCode: string;
       value: number;
       date: string;
       position: number;
       type: string;
}

export interface RankMonthValue {
       position: number;
       month: string;
       year: string;
       value: number;
       type: string;
}

export interface RankSeasonValue {
       position: number;
       season: string;
       year: string;
       value: number;
       type: string;
}

export interface MonthlyValueYear {
       year: string;
       value: number;
       variable: string;
}
export enum Variables {
    TEMPERATURE_MAX,
    TEMPERATURE_MIN,
    TEMPERATURE_MEAN,
    PRECIPITATION,
}
export interface StationData {
       code: string;
       name: string;
       longitude: number;
       latitude: number;
       altitude: number;
       provider: string;
       startDate: string;
       endDate: string;
       missingNumber: number;
       temperatureMax: number;
       temperatureMin: number;
       temperatureMed: number;
       precipitation: number;
}






