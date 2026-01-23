import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { SweetAlert } from '../../Core/service/sweet-alert';
import { AttendanceService } from '../../Core/service/attendance.service.service';

type TabType = 'scan' | 'upload';

@Component({
  selector: 'app-arrival',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrival.html',
  styleUrl: './arrival.scss'
})
export class Arrival {

  // Signals
  activeTab = signal<TabType>('scan');
  isScanning = signal(false);
  loading = signal(false);
ArrivalSound = new Audio('/Sound/good-boy-102414.mp3');
  // Services
  private _alert = inject(SweetAlert);
  private _attendanceService = inject(AttendanceService);

  // QR Code Reader
  private codeReader = new BrowserMultiFormatReader();

  // 🔁 Switch Tabs
  setTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  // 🎥 Camera Scan
  async startScan() {
    this.isScanning.set(true);

    try {
      const result = await this.codeReader.decodeOnceFromVideoDevice(
        undefined,
        'video'
      );

      this.isScanning.set(false);

      const employeeId = result.getText();
      this.handleQrResult(employeeId);

    } catch {
      this.isScanning.set(false);
      this._alert.toast('Failed to read QR code', 'error');
    }
  }

  // 📂 Upload QR Image
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.loading.set(true);

    try {
      const imgUrl = URL.createObjectURL(file);
      const result = await this.codeReader.decodeFromImageUrl(imgUrl);

      const employeeId = result.getText();
      this.handleQrResult(employeeId);

    } catch {
      this._alert.toast('Invalid QR image', 'error');
    } finally {
      this.loading.set(false);
    }
  }

handleQrResult(employeeId: string) {
  this._attendanceService.scanAttendance(employeeId).subscribe({
    next: (res) => {

      if (res.value.firstIn && !res.value.lastOut) {
        this.ArrivalSound.play();
        this._alert.toast('Check-in recorded successfully ✅', 'success');
        return;
      }

      if (res.value.lastOut) {
        this._alert.toast('Check-out recorded successfully ✅', 'success');
        return;
      }

      if (!res.success) {
        this._alert.toast(res.message || 'Attendance failed ⚠️', 'warning');
      }
    },
    error: () => {
      this._alert.toast('Error while recording attendance ❌', 'error');
    }
  });
}

}
