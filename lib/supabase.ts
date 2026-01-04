import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DownloadHistory = {
  id: string;
  video_url: string;
  video_title: string;
  platform: string;
  quality: string;
  thumbnail_url: string | null;
  duration: string | null;
  file_name: string;
  download_date: string;
  created_at: string;
};
