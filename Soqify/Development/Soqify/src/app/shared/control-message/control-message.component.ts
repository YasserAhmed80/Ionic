import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidatorService } from '../services/validator.service';

@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
  styleUrls: ['./control-message.component.scss'],
})
export class ControlMessageComponent  {

 
  @Input() control: FormControl;
  constructor() {}

  errorMessage() {
    
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidatorService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }

}
