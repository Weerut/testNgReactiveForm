import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { heroes, Address, Hero, states } from './data-model'
import { HeroService } from './hero.service';

@Component({
    selector: 'hero-detail',
    templateUrl: './hero-detail.component.html'
})

export class HeroDetailComponent implements OnChanges {
    @Input() hero: Hero;

    heroForm: FormGroup;
    states = states;
    nameChangeLog: string[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private heroService: HeroService) {

        this.createForm();
        this.logNameChange();
    }

    createForm() {
        this.heroForm = this._formBuilder.group({
            name: ['', Validators.required],
            secretLairs: this._formBuilder.array([]), // <-- secretLairs as an empty FormArray
            power: '',
            sidekick: ''
        });
    }

    logNameChange() {
        const nameControl = this.heroForm.get('name');
        nameControl.valueChanges.forEach(
            (value: string) => this.nameChangeLog.push(value)
        );
    }

    ngOnChanges(): void {
        this.heroForm.reset({
            name: this.hero.name,
        });
        this.setAddresses(this.hero.addresses);
    }

    get secretLairs(): FormArray {
        return this.heroForm.get('secretLairs') as FormArray;
    };

    setAddresses(addresses: Address[]) {
        const addressFGs = addresses.map(address => this._formBuilder.group(address));
        const addressFormArray = this._formBuilder.array(addressFGs);
        this.heroForm.setControl('secretLairs', addressFormArray);
    }

    addLair() {
        this.secretLairs.push(this._formBuilder.group(new Address()));
    }
    removeLair(addresses: Address) {
        this.secretLairs.removeAt(this.secretLairs.length - 1);
    }

    // 
    onSubmit() {
        this.hero = this.prepareSaveHero();
        this.heroService.updateHero(this.hero).subscribe(/* error handling */);
        this.ngOnChanges();
    }

    prepareSaveHero(): Hero {
        const formModel = this.heroForm.value;

        // deep copy of form model lairs
        const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
            (address: Address) => Object.assign({}, address)
        );

        // return new `Hero` object containing a combination of original hero value(s)
        // and deep copies of changed form model values
        const saveHero: Hero = {
            id: this.hero.id,
            name: formModel.name as string,
            // addresses: formModel.secretLairs // <-- bad!
            addresses: secretLairsDeepCopy
        };
        return saveHero;
    }
    revert() {
        this.ngOnChanges();
    }


}