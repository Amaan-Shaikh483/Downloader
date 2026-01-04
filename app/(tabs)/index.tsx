import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video, Youtube, Instagram, Facebook } from 'lucide-react-native';
import {
  detectPlatform,
  getMockVideoMetadata,
  getPlatformColor,
  QUALITY_OPTIONS,
  type Platform,
  type VideoMetadata,
} from '@/utils/platformDetection';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>(null);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleUrlChange = (text: string) => {
    setUrl(text);
    const detectedPlatform = detectPlatform(text);
    setPlatform(detectedPlatform);

    if (detectedPlatform) {
      const metadata = getMockVideoMetadata(detectedPlatform);
      setVideoData(metadata);
      setDownloadComplete(false);
    } else {
      setVideoData(null);
    }
  };

  const simulateDownload = async () => {
    if (!videoData || !platform) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(async () => {
      const fileName = `${videoData.title.replace(/[^a-z0-9]/gi, '_')}_${selectedQuality}.mp4`;

      await supabase.from('download_history').insert({
        video_url: url,
        video_title: videoData.title,
        platform: platform,
        quality: selectedQuality,
        thumbnail_url: videoData.thumbnail,
        duration: videoData.duration,
        file_name: fileName,
      });

      setIsDownloading(false);
      setDownloadComplete(true);
      setDownloadProgress(0);
    }, 2200);
  };

  const renderPlatformIcon = () => {
    if (!platform) return null;

    const iconProps = { size: 24, color: getPlatformColor(platform) };

    switch (platform) {
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Video size={32} color="#2563eb" />
          <Text style={styles.title}>Unified Media Downloader</Text>
          <Text style={styles.subtitle}>
            Educational Demo - URL Pattern Detection
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Paste Video URL</Text>
          <TextInput
            style={styles.input}
            placeholder="https://youtube.com/watch?v=..."
            value={url}
            onChangeText={handleUrlChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholderTextColor="#94a3b8"
          />

          {platform && (
            <View style={styles.platformBadge}>
              {renderPlatformIcon()}
              <Text
                style={[
                  styles.platformText,
                  { color: getPlatformColor(platform) },
                ]}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)} Detected
              </Text>
            </View>
          )}
        </View>

        {videoData && (
          <View style={styles.videoInfoContainer}>
            <Text style={styles.sectionTitle}>Video Information</Text>

            <Image
              source={{ uri: videoData.thumbnail }}
              style={styles.thumbnail}
            />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Title:</Text>
              <Text style={styles.infoValue}>{videoData.title}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>{videoData.duration}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform:</Text>
              <Text style={styles.infoValue}>
                {videoData.platform?.charAt(0).toUpperCase() +
                  videoData.platform?.slice(1)}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, styles.qualityTitle]}>
              Select Quality
            </Text>

            <View style={styles.qualityContainer}>
              {QUALITY_OPTIONS.map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.qualityButton,
                    selectedQuality === quality && styles.qualityButtonActive,
                  ]}
                  onPress={() => setSelectedQuality(quality)}>
                  <Text
                    style={[
                      styles.qualityText,
                      selectedQuality === quality &&
                        styles.qualityTextActive,
                    ]}>
                    {quality}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {isDownloading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${downloadProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{downloadProgress}%</Text>
              </View>
            )}

            {downloadComplete && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>
                  Demo download completed successfully!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.downloadButton,
                isDownloading && styles.downloadButtonDisabled,
              ]}
              onPress={simulateDownload}
              disabled={isDownloading}>
              <Text style={styles.downloadButtonText}>
                {isDownloading ? 'Downloading...' : 'Start Demo Download'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  platformText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  videoInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#e2e8f0',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  qualityTitle: {
    marginTop: 24,
  },
  qualityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  qualityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  qualityButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  qualityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  qualityTextActive: {
    color: '#2563eb',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  successText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
