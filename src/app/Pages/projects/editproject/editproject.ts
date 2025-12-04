import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../Core/service/project.service';
import { SweetAlert } from '../../../Core/service/sweet-alert';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ReactiveModeuls } from '../../../Shared/Modules/ReactiveForms.module';
import { ShortenPipe } from '../../../Shared/pipes/shorten-pipe';
import { Clients } from '../../../Core/service/clients';
import { Employees } from '../../../Core/service/employees';
import { IClients } from '../../../Core/Interface/iclients';
import { IEmployee } from '../../../Core/Interface/iemployee';

@Component({
  selector: 'app-editproject',
  standalone: true,
  imports: [ReactiveModeuls, ShortenPipe],
  templateUrl: './editproject.html',
  styleUrls: ['./editproject.scss']
})
export class Editproject {
  private _client = inject(Clients);
  private _employee = inject(Employees);
  private _project = inject(ProjectService);
  private _alert = inject(SweetAlert);
  private _location = inject(Location);
  private _route = inject(ActivatedRoute);

  Clients = signal<IClients[]>([]);
  Employee = signal<IEmployee[]>([]);
  baseimageUrl = `${environment.baseimageUrl}`;

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('descInput') descInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  files: File[] = [];
  leftSelected = signal<any | null>(null); // ✅ client id
  rightSelected = signal<any[]>([]); // ✅ employee ids
  selectedClientTitle: string | null = null;
  selectedDate: Date | null = null;
  paymentAmount = signal<number>(0);
  projectType = signal<number>(0);

  options = ['IN PROGRESS', 'PAUSED', 'COMPLETED'];
  clientTitleMap: { [key: string]: number } = {
    'IN PROGRESS': 0,
    'PAUSED': 1,
    'COMPLETED': 2
  };

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  currentDate = new Date();
  today = new Date();
  days: { number: string, faded: boolean, today: boolean }[] = [];
  monthLabel = '';
  yearLabel = 0;

  projectId!: string;
  existingAttachments: any[] = [];

  ngOnInit(): void {
    const idParam = this._route.snapshot.paramMap.get('id');
    this.projectId = idParam ?? '';

    // Load Clients + Employees
    this._client.getAll({ pageNumber: 1, pageSize: 50, ProjectStatus: null }).subscribe({
      next: res => this.Clients.set(res.value)
    });

    this._employee.getAll({}).subscribe({
      next: res => this.Employee.set(res.value)
    });

    // Load Project Data
    this._project.getById(this.projectId).subscribe({
      next: (res) => {
       const project = res.value;
        const employeeIds = project.employees.map((emp: any) => emp.id);

        this.titleInput.nativeElement.value = project.projectTitle;
        this.descInput.nativeElement.value = project.projectDescription;
        this.selectedClientTitle = this.options[project.projectStatus];
              this.projectType.set(project.projectType); // <--- هنا

                      this.paymentAmount.set(project.projectPayment);
        // ✅ fix signals
    this.leftSelected.set(project.clientId); // <--- استخدم clientId
        this.rightSelected.set(employeeIds);

        this.selectedDate = new Date(project.deadLine);
        this.existingAttachments = project.attachments || [];
      }
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

  // Calendar
  renderCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    this.monthLabel = this.months[month];
    this.yearLabel = year;
    this.days = [];

    for (let i = firstDay; i > 0; i--) {
      this.days.push({ number: String(prevMonthLastDay - i + 1), faded: true, today: false });
    }

    for (let i = 1; i <= lastDay; i++) {
      this.days.push({
        number: String(i).padStart(2, '0'),
        faded: false,
        today: i === this.today.getDate() && month === this.today.getMonth() && year === this.today.getFullYear()
      });
    }

    const remainingDays = (7 - (this.days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      this.days.push({ number: String(i), faded: true, today: false });
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

  selectDay(day: { number: string; faded: boolean; today: boolean }) {
    if (day.faded) return;
    const year = this.yearLabel;
    const month = this.months.indexOf(this.monthLabel);
    const dayNumber = parseInt(day.number);
    this.selectedDate = new Date(year, month, dayNumber);
  }

  selectClientTitle(title: string) {
    this.selectedClientTitle = this.selectedClientTitle === title ? null : title;
  }

  selectLeft(clientId: any) {
    this.leftSelected.set(clientId);
  }

  toggleRight(userId: any) {
    const current = this.rightSelected();
    if (current.includes(userId)) {
      this.rightSelected.set(current.filter(id => id !== userId));
    } else {
      this.rightSelected.set([...current, userId]);
    }
  }

  // ✅ helper to check if employee selected
  isEmployeeSelected(id: string) {
    return this.rightSelected().includes(id);
  }

  // ✅ helper to check if client selected
  isClientSelected(id: string) {
    return this.leftSelected() === id;
  }

  updateProject() {
    if (
      !this.selectedClientTitle ||
      !this.leftSelected() ||
      this.rightSelected().length === 0 ||
      !this.selectedDate
    ) {
      this._alert.toast('Please fill all required fields.', 'warning');
      return;
    }

    const projectStatus = this.clientTitleMap[this.selectedClientTitle];
    const deadline = this.selectedDate.toISOString();

    const formData = new FormData();
    formData.append('ProjectTitle', this.titleInput.nativeElement.value);
    formData.append('ProjectDescription', this.descInput.nativeElement.value);
    formData.append('ProjectStatus', projectStatus.toString());
    formData.append('DeadLine', deadline);
    formData.append('ClientId', this.leftSelected()!);
  formData.append('ProjectPayment', String(this.paymentAmount())); 

    this.rightSelected().forEach(id => formData.append('EmployeeIds', id));
    this.files.forEach(file => formData.append('AttachmentUrl', file, file.name));

    this._project.update(this.projectId, formData).subscribe({
      next: () => {
        this._alert.toast('Project updated successfully!', 'success');
        this._location.back();
      },
      error: () => {
        this._alert.toast('Error updating project', 'error');
      }
    });
  }
}
