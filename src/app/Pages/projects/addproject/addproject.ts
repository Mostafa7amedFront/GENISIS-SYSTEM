import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { Clients } from '../../../Core/service/clients';
import { Employees } from '../../../Core/service/employees';
import { ProjectService } from '../../../Core/service/project.service';
import { IClients } from '../../../Core/Interface/iclients';
import { IEmployee } from '../../../Core/Interface/iemployee';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { environment } from '../../../../environments/environment';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { Location } from '@angular/common';

@Component({
  selector: 'app-addproject',
  imports: [ReactiveModeuls, ShortenPipe],
  templateUrl: './addproject.html',
  styleUrl: './addproject.scss'
})
export class Addproject {

  // Dependency Injection
  private _client = inject(Clients);
  private _project = inject(ProjectService);
  private _employee = inject(Employees);
private _alert = inject(SweetAlert); 
  private _location = inject(Location);
  //  Reactive Signals
  Clients = signal<IClients[]>([]);
  Employee = signal<IEmployee[]>([]);
@ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
@ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
  //  Environment Variables
  baseimageUrl = `${environment.baseimageUrl}`;

  //  Calendar Variables
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  currentDate = new Date();
  today = new Date();
  days: { number: string, faded: boolean, today: boolean }[] = [];
  monthLabel = '';
  yearLabel = 0;

  //  File Upload Variables
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  files: { name: string; size: string; type: string }[] = [];

  //  Selection Variables
  leftSelected = 0;
  rightSelected: number[] = [];
selectedDate: Date | null = null;
  options = [ 'IN PROGRESS', 'PAUSED', 'COMPLETED'];
clientTitleMap: { [key: string]: number } = {
  'IN PROGRESS': 0,
  'PAUSED': 1,
  'COMPLETED': 2
}; 
 selectedClientTitle: string | null = null;
  //  Lifecycle Hook
  ngOnInit(): void {
    // Fetch clients
    this._client.getAll({
      pageNumber: 1,
      pageSize: 50,
      ProjectStatus: null
    }).subscribe({
      next: (res) => this.Clients.set(res.value)
    });

    // Fetch employees
    this._employee.getAll({}).subscribe({
      next: (res) => this.Employee.set(res.value)
    });

    // Render calendar
    this.renderCalendar(this.currentDate);
  }

  //  File Upload Handlers

  /** Opens the hidden file input when upload button is clicked */
  onUploadClick() {
    this.fileInput.nativeElement.click();
    console.log(this.files)
  }

  /** Handles file selection and stores file info */
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.files = []; // تنظيف القائمة قبل التحديث
    Array.from(input.files).forEach(file => {
      this.files.push({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        type: file.type
      });
    });
  }
}

selectDay(day: { number: string; faded: boolean; today: boolean }) {
  if (day.faded) return;

  const year = this.yearLabel;
  const month = this.months.indexOf(this.monthLabel); // 0-based month
  const dayNumber = parseInt(day.number);

  this.selectedDate = new Date(year, month, dayNumber);
  console.log('Selected full date:', this.selectedDate);
}
  renderCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.monthLabel = this.months[month];
    this.yearLabel = year;
    this.days = [];

    // Add previous month days (faded)
    for (let i = firstDay; i > 0; i--) {
      this.days.push({
        number: String(prevMonthLastDay - i + 1),
        faded: true,
        today: false
      });
    }

    for (let i = 1; i <= lastDay; i++) {
      this.days.push({
        number: String(i).padStart(2, '0'),
        faded: false,
        today:
          i === this.today.getDate() &&
          month === this.today.getMonth() &&
          year === this.today.getFullYear()
      });
    }

    const remainingDays = (7 - (this.days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      this.days.push({
        number: String(i),
        faded: true,
        today: false
      });
    }
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar(this.currentDate);
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar(this.currentDate);
  }

  //  Selection Logic

  selectLeft(name: number) {
    this.leftSelected = this.leftSelected === name ? 0 : name;
    console.log(this.leftSelected);
  }

  toggleRight(name: number) {
    if (this.rightSelected.includes(name)) {
      this.rightSelected = this.rightSelected.filter(n => n !== name);
    } else {
      this.rightSelected.push(name);
    }
    console.log(this.rightSelected);
  }

  //  Project Actions
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;
  }
addProject() {
  if (!this.selectedClientTitle || !this.leftSelected || this.rightSelected.length === 0 || !this.selectedDate) {
      this._alert.toast('Please fill all required fields and upload an image.' , 'warning');
    return;
  }

  const projectStatus = this.clientTitleMap[this.selectedClientTitle];

  const deadline = this.selectedDate.toDateString() + ' ' + this.selectedDate.toLocaleTimeString();

  const formData = new FormData();
  formData.append('ProjectTitle', this.titleInput.nativeElement.value);
  formData.append('ProjectDescription', this.descInput.nativeElement.value);
  formData.append('ProjectStatus', projectStatus.toString());
  formData.append('DeadLine', deadline);
  formData.append('ClientId', this.leftSelected.toString());

  this.rightSelected.forEach(id => {
    formData.append('EmployeeIds', id.toString());
  });

  const input = this.fileInput.nativeElement;
  if (input.files && input.files.length > 0) {
    Array.from(input.files).forEach(file => {
      formData.append('AttachmentUrl', file, file.name);
    });
  }

  this._project.add(formData).subscribe({
    next: (res) => {
                  this._alert.toast('Project added successfully!' , 'success');
            this._location.back(); // 👈 Go back to previous page

                  
    }, 
    error: (err) => {
                  this._alert.toast('Error adding project' , 'error');

    }
  });
}

}
