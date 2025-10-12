import { Component, inject, signal } from '@angular/core';
import { RouterLink, Routes } from '@angular/router';
import { Employees } from '../../Core/service/employees';
import { IEmployee } from '../../Core/Interface/iemployee';
import { environment } from '../../../environments/environment';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { Router } from '@angular/router';
import { LeadingZeroPipe } from '../../Shared/pipes/leading-zero-pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe, UpperCasePipe , LeadingZeroPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  private _Employees = inject(Employees);
  today = new Date();
  isLoading = signal(false);
  errorMessage = signal('');
  private _alert = inject(SweetAlert);
  private routes  = inject(Router);
  baseimageUrl = `${environment.baseimageUrl}`;
  cards = signal<IEmployee[]>([]);

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._Employees.getAll( { pageNumber: 1,pageSize: 50}).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (response.success && response.value.length > 0) {
          this.cards.set(response.value);
        } else {
          this.cards.set([]); 
        }
      },
      error: (err) => {
        this.isLoading.set(false);

        if (err.status === 503) {
          this.errorMessage.set('Service is temporarily unavailable (503). Please try again later.');
        } else if (err.status === 0) {
          this.errorMessage.set('Cannot connect to the server. Please check your internet connection.');
        } else {
          this.errorMessage.set('An unexpected error occurred while loading data.');
        }

        console.error('Error fetching employees:', err);
      }
    });
  }


getProjectCounts() {
  const risingTalent = this.cards().filter(p => p.employeeBadge === 0).length;
  const designStar = this.cards().filter(p => p.employeeBadge === 1).length;
  const topTier = this.cards().filter(p => p.employeeBadge === 2).length;
  const maestro = this.cards().filter(p => p.employeeBadge === 3).length;

  return { risingTalent, designStar, topTier, maestro };
}
  onDelete(card: IEmployee, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._alert.confirm(`Are you sure you want to delete ${card.name}?`, 'Confirm Delete')
      .then((result) => {
        if (result.isConfirmed) {
          this._Employees.delete(card.id).subscribe({
            next: (res) => {
              console.log('✅ Deleted:', res);
              this._alert.toast('Employee deleted successfully.', 'success');
              this.cards.update((list) => list.filter(e => e.id !== card.id));
            },
            error: (err) => {
              console.error('❌ Delete error:', err);
            this._alert.toast(err.error.detail, 'error');
            }
          });
        }
      });
  }

  onEdit(card: any, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Edit clicked', card);
    this.routes.navigate(['/editemployee', card.id]);
  }
}
