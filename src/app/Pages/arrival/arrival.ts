import { Component, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { SweetAlert } from '../../Core/service/sweet-alert';

type TabType = 'scan' | 'upload';

@Component({
  selector: 'app-arrival',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './arrival.html',
  styleUrl: './arrival.scss'
})
export class Arrival {

  activeTab = signal<TabType>('scan');
  isScanning = signal(false);
  loading = signal(false);

  private _alert = inject(SweetAlert);
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

      this._alert.toast(
        `QR Result: ${result.getText()}`,
        'success'
      );

    } catch {
      this.isScanning.set(false);

      this._alert.toast(
        'Failed to read QR code',
        'error'
      );
    }
  }

  // 📂 Upload QR
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.loading.set(true);

    try {
      const imgUrl = URL.createObjectURL(file);
      const result = await this.codeReader.decodeFromImageUrl(imgUrl);

      this._alert.toast(
        `QR Result: ${result.getText()}`,
        'success'
      );

    } catch {
      this._alert.toast(
        'Invalid QR image',
        'error'
      );
    } finally {
      this.loading.set(false);
    }
  }
}
