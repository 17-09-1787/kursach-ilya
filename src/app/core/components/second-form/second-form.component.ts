import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirstData} from "../../interfaces/first-data";
import {SecondData} from "../../interfaces/second-data";

@Component({
  selector: 'app-second-form',
  templateUrl: './second-form.component.html',
  styleUrls: ['./second-form.component.scss']
})
export class SecondFormComponent {

  @Output() toggle: EventEmitter<SecondData> = new EventEmitter();
  @Input() count!: FirstData;

  constructor() {}

  form = new FormGroup({
    numberOfProductsByWarehouse: new FormControl('', [Validators.required]),
    numberOfProductsByStores: new FormControl('', [Validators.required]),
    matrix: new FormControl('', [Validators.required])
  });

  public onSubmit(): void {
    const arrayA = this.form.controls.numberOfProductsByWarehouse.value === null ? '0' : this.form.controls.numberOfProductsByWarehouse.value.split(',');
    const arrayB = this.form.controls.numberOfProductsByStores.value === null ? '0' : this.form.controls.numberOfProductsByStores.value?.split(',');
    const matrix = this.form.controls.matrix.value === null ? '0' : this.form.controls.matrix.value?.split(',');

    const data: SecondData = {
      A: arrayA,
      B: arrayB,
      matrix: matrix
    };

    this.toggle.emit(data);
  }
}
