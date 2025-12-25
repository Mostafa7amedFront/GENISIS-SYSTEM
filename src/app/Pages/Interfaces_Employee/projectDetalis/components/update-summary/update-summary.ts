import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaBuyingService } from '../../../../../Core/service/media-buying.service';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { Location } from '@angular/common';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';

@Component({
  selector: 'app-update-summary',
  imports: [ReactiveModeuls],
  templateUrl: './update-summary.html',
  styleUrl: './update-summary.scss'
})
export class UpdateSummary {
  id!: string;
  summary: string = '';

  private _route = inject(ActivatedRoute);
  private api = inject(MediaBuyingService);
  private location = inject(Location);
  private _alert = inject(SweetAlert);

  ngOnInit() {
    this.id = this._route.snapshot.paramMap.get('id')!;
  }

  onSave() {
    if (!this.summary.trim()) {
      this._alert.toast('Please write a summary', 'warning');
      return;
    }

    this.api.UpdateSummary(this.id, this.summary).subscribe({
      next: () => {
        this._alert.toast('Summary Updated Successfully', 'success');

        setTimeout(() => {
          this.location.back();
        }, 0);
      },


      error: (err) => {
        this._alert.toast('Error updating summary', 'error');
      }
    });
  }
}
