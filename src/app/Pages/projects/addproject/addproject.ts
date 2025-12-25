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
@ViewChild('PaymentAmount') PaymentAmount!: ElementRef<HTMLInputElement>;

@ViewChild('Month', { static: false }) Month!: ElementRef<HTMLInputElement>;

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
files: File[] = [];

  //  Selection Variables
  leftSelected = 0;
  rightSelected: number[] = [];
selectedDate: Date | null = null;
  options = [ 'IN PROGRESS', 'PAUSED', 'COMPLETED'];
    Duration = [ 'Shor Term', 'Long Term'];
    Type = [ 'Simple', 'Social Media' , 'Media Buying'];

clientTitleMap: { [key: string]: number } = {
  'IN PROGRESS': 0,
  'PAUSED': 1,
  'COMPLETED': 2
}; 


durationMap: { [key: string]: number } = {
  'Short Term': 0,
  'Long Term': 1
};

typeMap: { [key: string]: number } = {
  'Simple': 0,
  'Social Media': 1,
  'Media Buying': 2
};
 selectedClientTitle: string | null = null;
 selectedStatus: string | null = null;
selectedDuration: string | null = null;
selectedType: string | null = null;
  ngOnInit(): void {
    // Fetch clients
    this._client.getAll({
      pageNumber: 1,
      pageSize: 50,
      ProjectStatus: null
    }).subscribe({
      next: (res) => this.Clients.set(res.value)
    });

    this._employee.getAll({}).subscribe({
      next: (res) => this.Employee.set(res.value)
    });

    this.renderCalendar(this.currentDate);
  }
  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const selectedFiles = Array.from(input.files);

    selectedFiles.forEach(file => {
      if (!this.files.some(f => f.name === file.name && f.size === file.size)) {
        this.files.push(file);
      }
    });

    if (this.files.length > 4) {
      this.files = this.files.slice(0, 4);
      this._alert.toast('You can only upload up to 4 files.', 'warning');
    }

    input.value = '';
  }
}
selectDay(day: { number: string; faded: boolean; today: boolean }) {
  if (day.faded) return;

  const year = this.yearLabel;
  const month = this.months.indexOf(this.monthLabel); // 0-based month
  const dayNumber = parseInt(day.number);

  this.selectedDate = new Date(year, month, dayNumber);
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


  selectLeft(name: number) {
    this.leftSelected = this.leftSelected === name ? 0 : name;
  }

  toggleRight(name: number) {
    if (this.rightSelected.includes(name)) {
      this.rightSelected = this.rightSelected.filter(n => n !== name);
    } else {
      this.rightSelected.push(name);
    }
  }

  //  Project Actions
  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;
  }
 selectDuration(dur: string) {
  this.selectedDuration = this.selectedDuration === dur ? null : dur;
}

selectType(type: string) {
  this.selectedType = this.selectedType === type ? null : type;
}
addProject() {
  if (
    !this.selectedClientTitle ||
    !this.selectedDuration ||
    !this.selectedType ||
    !this.leftSelected ||
    this.rightSelected.length === 0 ||
    !this.selectedDate
  ) {
    this._alert.toast('Please fill all required fields and upload an image.', 'warning');
    return;
  }

const projectStatus = this.clientTitleMap[this.selectedClientTitle!] ?? 0;
const projectDuration = this.durationMap[this.selectedDuration!] ?? 0;
const projectType = this.typeMap[this.selectedType!] ?? 0;

  const deadline = this.selectedDate.toDateString() + ' ' + this.selectedDate.toLocaleTimeString();

  const title = this.titleInput.nativeElement.value;
  const payment = this.PaymentAmount.nativeElement.value;
let month = '0';

if (this.Month) {
  const monthVal = this.Month.nativeElement.value;
  if (monthVal && +monthVal > 0) {
    month = monthVal;
  }
}
  const formData = new FormData();
  formData.append('ProjectTitle', title);
  formData.append('PaymentAmount', payment);
  formData.append('Month', month);


  formData.append('ProjectDescription', this.descInput.nativeElement.value);
  formData.append('ProjectStatus', projectStatus.toString());
  formData.append('projectDuration', projectDuration.toString());
  formData.append('ProjectType', projectType.toString());
  formData.append('DeadLine', deadline);
  formData.append('ClientId', this.leftSelected.toString());

  this.rightSelected.forEach(id => {
    formData.append('EmployeeIds', id.toString());
  });

  this.files.forEach(file => {
    formData.append('AttachmentUrl', file, file.name);
  });

this._project.add(formData).subscribe({
    next: () => {
      this._alert.toast('Project added successfully!', 'success');
      this._location.back();
    },
    error: () => {
      this._alert.toast('Error adding project', 'error');
    }
  });}

}
