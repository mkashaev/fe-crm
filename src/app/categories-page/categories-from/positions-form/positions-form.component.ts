import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionService } from '../../../shared/services/positions.service';
import { Position } from '../../../shared/intefaces';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionService: PositionService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(0)])
    });

    this.loading = true;
    this.positionService.fetch(this.categoryId)
      .subscribe((positions) => {
        this.loading = false;
        this.positions = positions;
      });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.form.patchValue({
      name: null,
      cost: 0
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();
    const position: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };
    console.log('P: ', position);
    this.positionService.create(position).subscribe(
      (newPosition: Position) => {
        MaterialService.toast('Позиция создана');
        this.positions.push(newPosition);
      },
      (err) => {
        this.form.enable();
        MaterialService.toast(err.error.message);
      },
      () => {
        this.modal.close();
        this.form.reset({ name: '', cost: 0 });
        this.form.enable();
      });
  }

  onDelete(position: Position) {

  }
}
