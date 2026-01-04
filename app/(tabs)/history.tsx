import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Clock, Youtube, Instagram, Facebook, Trash2 } from 'lucide-react-native';
import { supabase, type DownloadHistory } from '@/lib/supabase';
import { getPlatformColor } from '@/utils/platformDetection';

export default function HistoryScreen() {
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('download_history')
        .select('*')
        .order('download_date', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHistory();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('download_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting item:', error);
        return;
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderPlatformIcon = (platform: string) => {
    const iconProps = { size: 20, color: getPlatformColor(platform as any) };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderHistoryItem = ({ item }: { item: DownloadHistory }) => (
    <View style={styles.historyItem}>
      <Image
        source={{ uri: item.thumbnail_url || '' }}
        style={styles.historyThumbnail}
      />

      <View style={styles.historyContent}>
        <Text style={styles.historyTitle} numberOfLines={2}>
          {item.video_title}
        </Text>

        <View style={styles.historyMeta}>
          {renderPlatformIcon(item.platform)}
          <Text style={styles.historyMetaText}>{item.platform}</Text>
          <Text style={styles.historyMetaDot}>•</Text>
          <Text style={styles.historyMetaText}>{item.quality}</Text>
          {item.duration && (
            <>
              <Text style={styles.historyMetaDot}>•</Text>
              <Text style={styles.historyMetaText}>{item.duration}</Text>
            </>
          )}
        </View>

        <View style={styles.historyDate}>
          <Clock size={14} color="#94a3b8" />
          <Text style={styles.historyDateText}>
            {formatDate(item.download_date)}
          </Text>
        </View>

        <Text style={styles.fileName} numberOfLines={1}>
          {item.file_name}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Clock size={64} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>No Download History</Text>
      <Text style={styles.emptyStateText}>
        Your downloaded videos will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Download History</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          history.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#2563eb"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyMetaText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  historyMetaDot: {
    fontSize: 13,
    color: '#cbd5e1',
    marginHorizontal: 6,
  },
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDateText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  fileName: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
});
