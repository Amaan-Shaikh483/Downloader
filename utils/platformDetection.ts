export type Platform = 'youtube' | 'instagram' | 'facebook' | null;

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  platform: Platform;
}

export function detectPlatform(url: string): Platform {
  const trimmedUrl = url.trim().toLowerCase();

  if (
    trimmedUrl.includes('youtube.com') ||
    trimmedUrl.includes('youtu.be')
  ) {
    return 'youtube';
  }

  if (
    trimmedUrl.includes('instagram.com') ||
    trimmedUrl.includes('instagr.am')
  ) {
    return 'instagram';
  }

  if (
    trimmedUrl.includes('facebook.com') ||
    trimmedUrl.includes('fb.watch') ||
    trimmedUrl.includes('fb.com')
  ) {
    return 'facebook';
  }

  return null;
}

export function getMockVideoMetadata(platform: Platform): VideoMetadata | null {
  if (!platform) return null;

  const mockData: Record<Exclude<Platform, null>, VideoMetadata> = {
    youtube: {
      title: 'Educational Tutorial - Building Mobile Apps',
      thumbnail:
        'https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '12:34',
      platform: 'youtube',
    },
    instagram: {
      title: 'Instagram Reel - Mobile Development Tips',
      thumbnail:
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '0:45',
      platform: 'instagram',
    },
    facebook: {
      title: 'Facebook Video - Tech Tutorial',
      thumbnail:
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '8:22',
      platform: 'facebook',
    },
  };

  return mockData[platform];
}

export function getPlatformIcon(platform: Platform): string {
  const icons: Record<Exclude<Platform, null>, string> = {
    youtube: '▶️',
    instagram: '📷',
    facebook: '👥',
  };

  return platform ? icons[platform] : '';
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Exclude<Platform, null>, string> = {
    youtube: '#FF0000',
    instagram: '#E4405F',
    facebook: '#1877F2',
  };

  return platform ? colors[platform] : '#64748b';
}

export const QUALITY_OPTIONS = ['360p', '480p', '720p', '1080p'];
