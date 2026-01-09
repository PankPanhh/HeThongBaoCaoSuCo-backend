export type AlertType = 'urgent' | 'news' | 'warning' | 'info';

export interface Alert {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  type: AlertType;
  banner_image?: string;
  gallery?: string[];
  article_url?: string;
  priority: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export const AlertTypeLabels: Record<AlertType, string> = {
  urgent: 'Khẩn cấp',
  news: 'Tin tức',
  warning: 'Cảnh báo',
  info: 'Thông tin',
};

export const AlertTypeColors: Record<AlertType, string> = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  news: 'bg-blue-100 text-blue-800 border-blue-300',
  warning: 'bg-amber-100 text-amber-800 border-amber-300',
  info: 'bg-gray-100 text-gray-800 border-gray-300',
};
