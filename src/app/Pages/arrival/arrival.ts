import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { BrowserMultiFormatReader } from '@zxing/browser';

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

      Swal.fire({
        icon: 'success',
        title: 'QR Result',
        text: result.getText(),
        confirmButtonColor: '#00bec5'
      });

    } catch {
      this.isScanning.set(false);
      Swal.fire('Error', 'Camera error or QR not detected', 'error');
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

      Swal.fire({
        icon: 'success',
        title: 'QR Result',
        text: result.getText(),
        confirmButtonColor: '#00bec5'
      });

    } catch {
      Swal.fire('Invalid QR', 'Could not read QR image', 'error');
    } finally {
      this.loading.set(false);
    }
  }
}
