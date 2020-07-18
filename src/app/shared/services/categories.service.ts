import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../intefaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }
}
