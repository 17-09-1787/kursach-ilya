import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FirstData} from "../../interfaces/first-data";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

  @Output() toggle: EventEmitter<FirstData> = new EventEmitter();

  constructor() { }

  form = new FormGroup({
    numberOfWarehouses: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(10)]),
    numberOfStores: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(10)]),
  });

  public onSubmit(): void {
    const numberOfWarehouses = this.form.controls.numberOfWarehouses.value === null ? 1 : this.form.controls.numberOfWarehouses.value;
    const numberOfStores = this.form.controls.numberOfStores.value === null ? 1 : this.form.controls.numberOfStores.value;

    const data: FirstData = {
      A: numberOfWarehouses,
      B: numberOfStores
    };

    this.toggle.emit(data);
  }
}
