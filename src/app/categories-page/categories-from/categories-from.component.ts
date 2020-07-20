import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-categories-from',
  templateUrl: './categories-from.component.html',
  styleUrls: ['./categories-from.component.css'],
})
export class CategoriesFromComponent implements OnInit {
  form: FormGroup;
  isNew = true;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params.id) {
            this.isNew = false;
            return this.categoriesService.getById(params.id);
          }

          return of(null);
        })
      )
      .subscribe(
        (category) => {
          if (category) {
            this.form.patchValue({ name: category.name });
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  onSubmit(): void {}
}
