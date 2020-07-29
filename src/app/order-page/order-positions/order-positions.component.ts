import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionService } from '../../shared/services/positions.service';
import { Observable } from 'rxjs';
import { Position } from '../../shared/intefaces';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionService: PositionService
  ) { }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionService.fetch(params.id);
          }
        )
      );
  }

  addToOrder(position: Position) {

  }

}
