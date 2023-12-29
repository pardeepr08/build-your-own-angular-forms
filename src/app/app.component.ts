import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  fname = 'Sakshi';
  lname = 'rana';
  hasPassport = true;

  genders = [
    {
      name: 'Male',
      abbrev: 'M',
    },
   {
      name: 'Female',
      abbrev: 'F',
    }, 
    {
      name: 'Other',
      abbrev: 'O',
    },
  ];

  selectedGender =  {
    name: 'Other',
    abbrev: 'O',
  }

  compareFn(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

}
