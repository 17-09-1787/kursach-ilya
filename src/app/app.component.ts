import { Component } from '@angular/core';
import {FirstData} from "./core/interfaces/first-data";
import {SecondData} from "./core/interfaces/second-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public isVisibleFormFirst: boolean = true;
  public isVisibleFormSecond: boolean = false;
  public isVisibleTable: boolean = false;

  public count: any = [25];

  public arrayA: any = ['123'];
  public arrayB: any = ['123'];
  public matrix: any = ['123'];

  public firstData(data: FirstData): void {
    this.isVisibleFormFirst = false;

    this.count = data;

    this.isVisibleFormSecond = true;
  }

  public secondData(data: SecondData): void {
    this.arrayA = data.A;
    this.arrayB = data.B;
    this.matrix = [];

    let array = [];
    let matrix = typeof data.matrix === "string" ? [] : data.matrix;

    for (let i = 0; i < this.count.A; i++) {
      array = [];
      for (let j = 0; j < this.count.B; j++) {
        array.push(matrix[j]);
      }
      matrix = matrix.splice(this.count.B);
      this.matrix.push(array);
    }

    this._generateAnswer();
  }

  private _generateAnswer(): void {

    this.isVisibleFormSecond = false;
    this.isVisibleTable = true;
  }

}

