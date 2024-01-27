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

  selectedGender = {
    name: 'Female',
    abbrev: 'F',
  };

  languages = [
    {
      name: 'English',
      abbrev: 'en',
    },
    {
      name: 'French',
      abbrev: 'fr',
    },
    {
      name: 'Russian',
      abbrev: 'rs',
    },
  ];

  //languagesKnown = ["English", "Russian"];

  languagesKnown = [
    {
      name: 'French',
      abbrev: 'fr',
    },
    {
      name: 'Russian',
      abbrev: 'rs',
    }
  ];

  compareFn(o1: any, o2: any): boolean {
    return o1?.name === o2?.name;
  }
}
