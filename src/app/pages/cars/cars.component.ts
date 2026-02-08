import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CarService, Car } from '../../core/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
})
export class CarsComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  newCar: Car = this.getEmptyCarObject();
  editCarId: string | number | null = null;
  editCar: Partial<Car> = {};
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';

  carburantOptions = ['Essence', 'Diesel', 'Hybride', 'Électrique'];

  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);

  constructor(private carService: CarService) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Running in browser - loading cars');
      this.loadCars();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCars() {
    this.loading = true;
    this.error = '';

    this.carService
      .getCars()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cars) => {
          this.cars = cars;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des voitures';
          this.loading = false;
        },
      });
  }

  addCar() {
    if (!this.validateCar(this.newCar)) return;

    this.submitting = true;
    this.error = '';
    this.successMessage = '';

    this.carService
      .addCar(this.newCar)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdCar) => {
          this.successMessage = `${createdCar.marque} ${createdCar.modele} ajouté avec succès!`;
          this.newCar = this.getEmptyCarObject();
          this.submitting = false;
          this.loadCars();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.error = err.error?.message || "Erreur lors de l'ajout";
          this.submitting = false;
          console.error('Add error:', err);
        },
      });
  }

  startEdit(car: Car) {
    this.editCarId = car.id!;
    this.editCar = { ...car };
    this.error = '';
    this.successMessage = '';
  }

  saveEdit() {
    if (this.editCarId != null) {
      if (!this.validateCar(this.editCar as Car)) return;

      this.submitting = true;
      this.error = '';

      this.carService
        .updateCar(this.editCarId, this.editCar)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedCar) => {
            this.successMessage = `${updatedCar.marque} ${updatedCar.modele} mis à jour avec succès!`;
            this.editCarId = null;
            this.editCar = {};
            this.submitting = false;
            this.loadCars();

            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (err) => {
            this.error = err.error?.message || 'Erreur lors de la mise à jour';
            this.submitting = false;
            console.error('Update error:', err);
          },
        });
    }
  }

  cancelEdit() {
    this.editCarId = null;
    this.editCar = {};
    this.error = '';
    this.successMessage = '';
  }

  deleteCar(id: string | number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      this.submitting = true;
      this.error = '';

      this.carService
        .deleteCar(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Voiture supprimée avec succès!';
            this.submitting = false;
            this.loadCars();

            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (err) => {
            this.error = err.error?.message || 'Erreur lors de la suppression';
            this.submitting = false;
            console.error('Delete error:', err);
          },
        });
    }
  }

  private validateCar(car: Car): boolean {
    if (!car.marque || car.marque.trim().length < 2) {
      this.error = 'La marque doit contenir au moins 2 caractères';
      return false;
    }
    if (!car.modele || car.modele.trim().length < 2) {
      this.error = 'Le modèle doit contenir au moins 2 caractères';
      return false;
    }
    if (car.prix <= 0) {
      this.error = 'Le prix doit être positif';
      return false;
    }
    if (!car.dateMiseEnVente) {
      this.error = 'La date de mise en vente est requise';
      return false;
    }
    this.error = '';
    return true;
  }

  private getEmptyCarObject(): Car {
    return {
      marque: '',
      modele: '',
      prix: 0,
      carburant: 'Essence',
      imageUrl: '',
      disponible: true,
      dateMiseEnVente: new Date().toISOString().split('T')[0],
    };
  }
}
