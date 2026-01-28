import { Component, OnInit } from '@angular/core';
import { CarService, Car } from '../../core/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  newCar: Car = { make: '', model: '', year: new Date().getFullYear() };
  editCarId: string | null = null;
  editCar: Partial<Car> = {};

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getCars().subscribe((cars) => (this.cars = cars));
  }

  addCar() {
    this.carService.addCar(this.newCar).subscribe(() => {
      this.newCar = { make: '', model: '', year: new Date().getFullYear() };
      this.loadCars();
    });
  }

  startEdit(car: Car) {
    this.editCarId = car.id!;
    this.editCar = { ...car };
  }

  saveEdit() {
    if (this.editCarId != null) {
      this.carService.updateCar(this.editCarId, this.editCar).subscribe(() => {
        this.editCarId = null;
        this.editCar = {};
        this.loadCars();
      });
    }
  }

  cancelEdit() {
    this.editCarId = null;
    this.editCar = {};
  }

  deleteCar(id: string) {
    this.carService.deleteCar(id).subscribe(() => this.loadCars());
  }
}
