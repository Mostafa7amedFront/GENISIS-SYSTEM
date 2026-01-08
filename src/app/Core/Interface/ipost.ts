export interface  Post {
  id: number;
  title: string;
  postingAt: string;
  caption: string;
  captionArabic: string;
  captionEng?: string;
  captionAra?: string;
  description: string;
  number?: number;
  cover: string | null;
  fileType: number;
  file?: string | null; // خلى file اختياري
}
