export interface  Post {
  id: number;
  title: string;
  date: string;
  caption: string;
  captionArabic: string;
  captionEng?: string;
  captionAra?: string;
  description: string;
  number?: number;
  fileType: number;
  file?: string | null; // خلى file اختياري
}
