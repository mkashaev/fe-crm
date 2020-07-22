import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { Category } from '../../shared/intefaces';

@Component({
  selector: 'app-categories-from',
  templateUrl: './categories-from.component.html',
  styleUrls: ['./categories-from.component.css'],
})
export class CategoriesFromComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  image: File;
  isNew = true;
  imagePreview: any;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

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
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({ name: category.name });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  deleteCategory() {
    const confirm = window.confirm(`Вы уверены, что хотите кдалить категорию ${this.category.name}`);
    if (confirm) {
      this.categoriesService
        .delete(this.category._id)
        .subscribe(
          (res) => MaterialService.toast(res.message),
          (err) => MaterialService.toast(err.error.message),
          () => this.router.navigate(['/categories'])
        );
    }
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      (category) => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable();
      },
      (err) => {
        MaterialService.toast(err.error.message);
        console.log('Err: ', err);
        this.form.enable();
      }
    );
  }
}
