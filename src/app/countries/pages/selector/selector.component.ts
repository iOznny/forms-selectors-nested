import { Component, OnInit } from '@angular/core';

// From
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interfaces
import { CountrySmall } from '../../interfaces/countries.interfaces';

// Services
import { CountriesService } from '../../services/countries.service';

//RXJS
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html'
})

export class SelectorComponent implements OnInit {

  public form!: FormGroup;

  // Selectores
  public regions: string[] = [];
  public countrySmall: CountrySmall[] = [];
  public countryBorders: CountrySmall[] = [];

  public loading: boolean = false;
  
  constructor(private fb: FormBuilder, private _countrieService: CountriesService) { 
    /**
     * Inicialización del Formulario
     * Ejecución de la función de su creación.
    */
    this.formCreate();
  }

  ngOnInit(): void {
    // Obtenemos y asignamos las regiones del Countries Services.
    this.regions = this._countrieService.regions;

    // Obtener los paises dependiendo de la Región seleccionada.
    this.form.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.form.get('country')?.reset('');
          this.loading = true;       
        }), 
        switchMap(region => this._countrieService.getCountriesByRegion(region))
      )
      .subscribe(countries => {
          this.loading = false;
          // Asignamos los paises.
          this.countrySmall = countries;      
        }
      );

    // Obtenemos el País por el código.
    this.form.get('country')?.valueChanges
      .pipe(
        tap((_) => {
          this.countryBorders = [];          
          this.form.get('border')?.reset('');
          this.loading = true;
        }), 
        switchMap(code => this._countrieService.getCountryByCode(code)),        
        switchMap(country => this._countrieService.getCountriesByCode(country?.borders!))        
      )
      .subscribe(countries => {
          this.loading = false;
          // Asignamos los borders que tiene el país.
          this.countryBorders = countries;
        }
      );
  }

  /**
   * Creación del Formulario
   * Estructura base.
   */
  public formCreate() {
    this.form = this.fb.group({
      region: ['', [Validators.required]],
      country: ['', [Validators.required]],
      border: ['', [Validators.required]]
    });
  }

  /**
   * Posteo del formulario con la información.
   */
  onSubmit() {
    console.log(this.form.value);
  }

}
