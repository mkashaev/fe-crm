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
  positionId = null;
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
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset({ name: null, cost: 0 });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({ name: '', cost: 0 });
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition).subscribe(
        (position: Position) => {
          const idx = this.positions.findIndex((p) => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        (err) => {
          this.form.enable();
          MaterialService.toast(err.error.message);
        },
        completed
      );
    } else {
      this.positionService.create(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        (err) => {
          this.form.enable();
          MaterialService.toast(err.error.message);
        },
        completed
      );
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию "${position.name}"?`);

    if (decision) {
      this.positionService.delete(position).subscribe(
        (response) => {
          const idx = this.positions.findIndex((p) => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        (err) => MaterialService.toast(err.error.message)
      );
    }
  }
}
