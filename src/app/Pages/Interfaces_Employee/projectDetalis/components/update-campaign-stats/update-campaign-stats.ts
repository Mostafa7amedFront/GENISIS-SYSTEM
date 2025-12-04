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

  campaignType = signal<CampaignType>(CampaignType.Engagement);
  id = signal<string>('');

  // نستخدم signal array للحقول
  fields = signal<Field[]>([
    { name: '', type: 0 },
    { name: '', type: 0 },
    { name: '', type: 0 },
    { name: '', type: 0 },
    { name: '', type: 0 },
    { name: '', type: 0 }
  ]);

  hoverIndex: number | null = null;
  hoverType: number | null = null;

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id')!;
    this.id.set(projectId);
  }

  selectCampaign(value: 'Engagement' | 'Awareness' | 'Sales') {
    const map = {
      Sales: CampaignType.Sales,
      Engagement: CampaignType.Engagement,
      Awareness: CampaignType.Awareness,
    };
    this.campaignType.set(map[value]);
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
    // تأكد من كل الحقول موجودة
    const invalid = this.fields().some(f => !f.name.trim());
    if (invalid) {
      this._alert.toast('Please fill all field titles', 'warning');
      return;
    }

    this.api.addMediaBuyingField(this.id(), this.campaignType(), this.fields())
      .subscribe({
        next: () => {
          this._alert.toast('Updated Campaign Stats Successfully', 'success');
          
        setTimeout(() => {
          this.location.back();
        }, 0);
        },
        error: () => {
          this._alert.toast('Error updating Campaign Stats', 'error');
        }
      });
  }
}
