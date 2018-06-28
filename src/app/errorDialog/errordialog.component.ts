import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nodatadialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.css']
})
export class ErrordialogComponent implements OnInit {

  title: string;
  content: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, translate: TranslateService ) {
    translate.get(data.title).subscribe((res: string) => {
                      this.title = res;
            });
    translate.get(data.content).subscribe((res: string) => {
                      this.content = res;
            });
  }

  ngOnInit() {

  }

}
