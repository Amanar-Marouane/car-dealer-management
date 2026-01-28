import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private api = 'http://localhost:3001/cars';

  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.api);
  }

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.api}/${id}`);
  }

  addCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.api, car);
  }

  updateCar(id: string, car: Partial<Car>): Observable<Car> {
    return this.http.patch<Car>(`${this.api}/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
