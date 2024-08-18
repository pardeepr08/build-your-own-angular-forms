import { Component, Directive } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from 'src/forms/src/directives/validators';
import { AbstractControl } from 'src/forms/src/model/AbstractControl';

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

  selectedGender = 'Female';

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

  count = 5;
}


@Directive({
  selector: '[forbiddenNames]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ForbiddenNames,
    multi: true
  }]
})
export class ForbiddenNames implements AsyncValidator {
  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (control.value === 'tom') {
          resolve({ forbiddenNames: true });
        }
        resolve(null);
      }, 2000)
    })
  }
}

@Directive({
  selector: '[forbiddenNames2]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: ForbiddenNames2,
    multi: true
  }]
})
export class ForbiddenNames2 implements AsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable(observer => {
      setTimeout(() => {
        if (control.value === 'harry') {
          observer.next({ forbiddenNames2: true });
        }
        else {
          observer.next(null);
        }
        observer.complete();
      }, 2000)
    })
  }
}