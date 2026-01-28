import { Component, signal, inject } from '@angular/core';
import { ReactiveModeuls } from '../../../../../Shared/Modules/ReactiveForms.module';
import { ActivatedRoute } from '@angular/router';
import { MediaBuyingService } from '../../../../../Core/service/media-buying.service';
import { SweetAlert } from '../../../../../Core/service/sweet-alert';
import { Location } from '@angular/common';

enum CampaignType {
  Engagement = 0,
  Awareness = 1,
  Sales = 2
}

interface Field {
  id: string;
  name: string;
  type: number;
}

@Component({
  selector: 'app-update-campaign-stats',
  imports: [ReactiveModeuls],
  templateUrl: './update-campaign-stats.html',
  styleUrl: './update-campaign-stats.scss'
})
export class UpdateCampaignStats {

  private route = inject(ActivatedRoute);
  private api = inject(MediaBuyingService);
  private location = inject(Location);
  private _alert = inject(SweetAlert);

  isLoading = signal(false);
  campaignType = signal<CampaignType>(CampaignType.Engagement);
  id = signal<string>('');

  // لازم الـ initial values تطابق الـ interface (فيها id)
  fields = signal<Field[]>([
    { id: '', name: '', type: 0 },
    { id: '', name: '', type: 0 },
    { id: '', name: '', type: 0 },
    { id: '', name: '', type: 0 },
    { id: '', name: '', type: 0 },
    { id: '', name: '', type: 0 }
  ]);

  hoverIndex: number | null = null;
  hoverType: number | null = null;

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id')!;
    this.id.set(projectId);
    this.loadStats();
  }

  // ==========================
  // Load Stats
  // ==========================
  loadStats() {
    if (!this.id()) return;

    this.api.GetMediaBuyingFields(this.id(), this.campaignType())
      .subscribe({
        next: res => {
          // مهم: خزّن الـ id اللي راجع من الـ API
          this.fields.set(
            res.value.map((f: any) => ({
              id: f.mediaBuyingFieldId ?? f.id ?? '',
              name: f.name ?? '',
              type: f.fieldType ?? 0
            }))
          );
        },
        error: err => this._alert.toast(err?.error?.detail ?? 'Error loading stats', 'error')
      });
  }

  selectCampaign(value: 'Engagement' | 'Awareness' | 'Sales') {
    const map = {
      Sales: CampaignType.Sales,
      Engagement: CampaignType.Engagement,
      Awareness: CampaignType.Awareness,
    };
    this.campaignType.set(map[value]);
    this.loadStats();
  }

  setType(index: number, value: number) {
    const updatedFields = [...this.fields()];
    updatedFields[index].type = value;
    this.fields.set(updatedFields);
  }

  updateName(index: number, value: string) {
    const updatedFields = [...this.fields()];
    updatedFields[index].name = value;
    this.fields.set(updatedFields);
  }

  getTooltip(t: number) {
    return t === 0 ? 'Sum' :
           t === 1 ? 'Average' :
           t === 2 ? 'Count' : '';
  }

send() {
  const invalidName = this.fields().some(f => !f.name.trim());
  if (invalidName) {
    this._alert.toast('Please fill all field titles', 'warning');
    return;
  }

  const missingIds = this.fields().some(f => !f.id);
  if (missingIds) {
    this._alert.toast('Some fields are missing ids. Please reload stats.', 'warning');
    return;
  }

  this.isLoading.set(true);

  this.api.addMediaBuyingField(this.id(), this.campaignType(), this.fields())
    .subscribe({
      next: () => {
        this._alert.toast('Updated Campaign Stats Successfully', 'success');
        this.isLoading.set(false);
        setTimeout(() => this.location.back(), 0);
      },
      error: (err) => {
        this._alert.toast(err?.error?.detail ?? 'Error updating Campaign Stats', 'error');
        this.isLoading.set(false);
      }
    });
}

}
