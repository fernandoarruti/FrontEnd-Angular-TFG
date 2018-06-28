import { RankValue } from '../dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-tablestats',
  templateUrl: './tablestats.component.html',
  styleUrls: ['./tablestats.component.css']
})
export class TablestatsComponent implements OnInit {
  @Input() maximumTableValues: MatTableDataSource<RankValue>;
  @Input() minimumTableValues: MatTableDataSource<RankValue>;

  displayedColumns = ['position', 'date', 'value'];
  constructor() { }

  ngOnInit() {}

}
