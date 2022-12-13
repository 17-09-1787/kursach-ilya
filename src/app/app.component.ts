import {Component} from '@angular/core';
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

  public data!: any;

  public count: any = [];

  public arrayA: any = [];
  public arrayB: any = [];
  public matrix: any = [];

  public typeTask!: string;

  public hideButton: boolean = false;
  public showButton: boolean = false;

  public filled: number = 0;

  public rows: any[] = [];
  public columns: any[] = [];

  public systemEquation: any[] = [];

  public needMatrix: any[] = [];

  public lastMatrix: any[] = [];
  public total!: number;

  public visibleTotal = false;

  /* Принимает данные из первой формы*/

  public firstData(data: FirstData): void {
    this.isVisibleFormFirst = false;

    this.count = data;

    this.isVisibleFormSecond = true;
  }

  /* Принимает данные из второй формы*/

  public secondData(data: SecondData): void {
    this.data = data;
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

    this.data.matrix = this.matrix;

    this._visible();
    this._checkTypeTask();
  }

  /* Считает ответ с помощью метода северо-западного угла */

  public northwestCornerMethod(): void {
    const resource = this.arrayA.map((el: string | number) => el);
    const requirement = this.arrayB.map((el: string | number) => el);

    let array = [];
    let matrix: any[] = [];

    let remainsA;
    let remainsB;

    for (let i = 0; i < resource.length; i++) {
      array = [];
      remainsA = +resource[i];
      for (let j = 0; j < requirement.length; j++) {
        remainsB = +requirement[j];
        if (remainsA !== 0 && remainsB !== 0) {
          if (remainsA > remainsB) {
            remainsA = remainsA - remainsB;
            requirement[j] = 0;
            array.push(remainsB);
          } else if (remainsA === remainsB) {
            remainsA = 0;
            requirement[j] = 0;
            array.push(remainsB);
          } else if (remainsA < remainsB) {
            const difference = remainsB - remainsA;
            requirement[j] = difference;
            array.push(remainsA);
            remainsA = 0;
          }
          this.filled += 1;
        } else {
          array.push(0);
        }
      }
      matrix.push(array);
    }

    this.matrix = matrix;
    this.hideButton = true;

    this.total = this._getTotalAnswer();
  }

  /* Проверяет правильно ли посчитан опорный план */

  public checkTruth(): void {
    const data = this.count.A + this.count.B - 1;
    const arraySecondRule: boolean[] = [];
    const arrayThirdRule: boolean[] = [];
    const firstRule = data === this.filled;
    let secondRule = true;
    let thirdRule = true;

    /* SECOND RULE */

    this.arrayA.forEach((el: number | string, idx: number) => {
      arraySecondRule.push(this._sumOfArray(this.matrix[idx]) === +el);
    });


    arraySecondRule.forEach((el) => {
      if (!el) {
        secondRule = false;
      }
    });

    /* THIRD RULE */

    let array: number[] = [];

    this.arrayA.forEach((el: number | string, idx: number) => {
      array = [];

      this.arrayB.forEach((element: number | string, index: number) => {
        array.push(this.matrix[idx][index]);
      });

      arrayThirdRule.push(this._sumOfArray(array) === +el);
    });

    arrayThirdRule.forEach((el) => {
      if (!el) {
        thirdRule = false;
      }
    });

    if (firstRule && secondRule && thirdRule) {
      this.showButton = true;
    }
  }

  /* Получает и выводит ответ */

  public getAnswer(): void {

    this.visibleTotal = true;

    const matrix = JSON.parse(JSON.stringify(this.data.matrix));
    const checkMatrix = JSON.parse(JSON.stringify(this.matrix));

    this.arrayA.forEach((el: string | number, idx: number) => {
      checkMatrix[idx].forEach((element: string | number, index: number) => {
        if (element === 0) {
          matrix[idx][index] = 0;
        }
      });
    });

    for (let i = 0; i < this.count.A; i++) {
      this.rows.push(`u${i + 1}`);
    }

    for (let i = 0; i < this.count.B; i++) {
      this.columns.push(`v${i + 1}`);
    }

    this.columns[this.columns.length - 1] = 0;

    let array: any[] = [];

    for (let i = 0; i < this.count.A; i++) {
      for (let j = 0; j < this.count.B; j++) {
        if (+matrix[i][j] !== 0) {
          array = [];
          array.push(this.rows[i], this.columns[j], +matrix[i][j]);
          this.systemEquation.push(array);
        }
      }
    }

    for (let i = 0; i < this.systemEquation.length; i++) {
      this.needMatrix.push([]);
    }

    const length = this.systemEquation.length;

    for (let i = 0; i < length; i++) {
      this._checkTwoNumber();
      this._replaceKnown();
    }

    for (let i = 0; i < this.columns.length; i++) {

      this.columns[i] = this._checkMatrix(this.columns[i]);
    }

    for (let i = 0; i < this.rows.length; i++) {

      this.rows[i] = this._checkMatrix(this.rows[i]);
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 0) {
          matrix[i][j] = this.rows[i] + this.columns[j];
        }
      }
    }

    const defaultMatrix = JSON.parse(JSON.stringify(this.data.matrix));
    let arrayLast: any[] = [];

    for (let i = 0; i < defaultMatrix.length; i++) {
      arrayLast = [];
      for (let j = 0; j < defaultMatrix[i].length; j++) {
        arrayLast.push(+defaultMatrix[i][j] - +matrix[i][j]);
      }
      this.lastMatrix.push(arrayLast);
    }

    let checkNegative = false;

    for (let i = 0; i < this.lastMatrix.length; i++) {
      for (let j = 0; j < this.lastMatrix[i].length; j++) {
        if (this.lastMatrix[i][j] < 0) {
          checkNegative = true;
        }
      }
    }

    if (checkNegative) {
      this._withNegative();
    } else {
      this._withOutNegative();
    }

  }

  /* Если в оптимальной матрице есть хотя бы одно отрицательное число */

  private _withNegative(): void {
    let minNegative = 0;

    for (let i = 0; i < this.lastMatrix.length; i++) {
      for (let j = 0; j < this.lastMatrix[i].length; j++) {
        if (this.lastMatrix[i][j] < 0) {
          if (minNegative > this.lastMatrix[i][j]) {
            minNegative = this.lastMatrix[i][j];
          }
        }
      }
    }

  }

  private _withOutNegative(): void {

  }

  /* Показать на html какие-то блоки */

  private _visible(): void {
    this.isVisibleFormSecond = false;
    this.isVisibleTable = true;
  }

  /* Узнаём какого типа задача */

  private _checkTypeTask(): void {
    const sumA = this._sumOfArray(this.arrayA);
    const sumB = this._sumOfArray(this.arrayB);
    if (sumA === sumB) {
      this.typeTask = 'закрытая'
      this._closeTask();
    } else {
      this.typeTask = 'открытая'
      this._openTask();
    }
  }

  private _closeTask(): void {

  }

  private _openTask(): void {

  }

  /* Приватный метод, который считает сумму чисел из массива */

  private _sumOfArray(data: number[]): number {
    return data.reduce(function (previousValue: number, currentValue: number) {
      return +previousValue + +currentValue;
    });
  }

  /* Считает уравнение типа x + 5 = 10 */

  private _solveEquation(data: any[]): any {
    const values = data;
    let a;
    let b = 0;
    let c = values[values.length - 1];

    values.forEach((el: string | number, idx: number) => {
      if (typeof el === 'string') {
        a = el;
      } else if (c !== el) {
        b = el;
      }
    });

    return [a, c - b];
  }

  /* Вызывает зависимый метод и просматривает схожесть значений между двумя матрицами */

  private _replaceKnown(): void {
    for (let i = 0; i < this.systemEquation.length; i++) {
      for (let j = 0; j < this.systemEquation[i].length; j++) {
        this.systemEquation[i][j] = this._checkMatrix(this.systemEquation[i][j]);
      }
    }
  }

  /* Зависимый метод */

  private _checkMatrix(value: string | number): any {
    let elem: number | string = 0;
    let check = true;

    this.needMatrix.forEach((el: any) => {
      if (value == el[0] && check) {
        elem = el[1];
        check = false;
      } else if (check) {
        elem = value;
      }
    });

    return elem;
  }

  /* Проверяет есть ли два number в массиве типов, тем самым узнаём где в уравнении есть 1 неизвестное */

  private _checkTwoNumber(): void {
    for (let i = 0; i < this.systemEquation.length; i++) {
      let array = [];

      for (let j = 0; j < this.systemEquation[i].length; j++) {
        array.push(typeof this.systemEquation[i][j]);
      }

      let number = 0

      array.forEach((el: string, idx: number) => {
        if (el === 'number') {
          number += 1;
        }
      });

      if (number === 2) {
        const value = this._solveEquation(this.systemEquation[i]);
        this.needMatrix[i] = value;
        this.systemEquation[i] = [];
      }
    }
  }

  /* Получаем конечный ответ */

  private _getTotalAnswer(): number {

    const matrix = JSON.parse(JSON.stringify(this.data.matrix));
    const checkMatrix = JSON.parse(JSON.stringify(this.matrix));

    let total = 0;

    for (let i = 0; i < checkMatrix.length; i++) {
      for (let j = 0; j < checkMatrix[i].length; j++) {
        if (checkMatrix[i][j] !== 0) {
          total += checkMatrix[i][j] * matrix[i][j];
        }
      }
    }

    return total;
  }

}
