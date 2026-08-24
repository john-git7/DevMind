import { useState, useCallback, useEffect } from 'react';
import api from '../lib/api';

export function useRepos(embeddingModel: string) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexProgress, setIndexProgress] = useState<any>(null);
  const [indexedRepos, setIndexedRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [isSkippingFile, setIsSkippingFile] = useState(false);
  const [repoAnalysis, setRepoAnalysis] = useState<any>(null);

  const fetchIndexedRepos = useCallback(async () => {
    try {
      const res = await api.get('/api/repos/indexed');
      if (res.status === 200) {
        setIndexedRepos(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch indexed repos', err);
    }
  }, []);

  useEffect(() => {
    fetchIndexedRepos();
  }, [fetchIndexedRepos]);

  const pauseIndexing = async (url: string) => {
    try {
      await api.post('/api/repos/pause', { url });
      setIsIndexing(false);
      fetchIndexedRepos();
    } catch (e) {
      console.error('Failed to pause indexing', e);
    }
  };

  const skipCurrentFile = async (url: string, filePath: string) => {
    setIsSkippingFile(true);
    try {
      await api.post('/api/repos/skip-file', { url, filePath });
      setIndexProgress((prev: any) => prev ? { ...prev, isWaiting: false, message: 'Skipping file...' } : null);
    } catch (e: any) {
      console.error('Failed to skip file', e);
      alert('Failed to skip file: ' + (e.response?.data?.error || e.message));
    } finally {
      setIsSkippingFile(false);
    }
  };

  const deleteWorkspace = async (url: string, onDeleted?: () => void) => {
    if (!window.confirm('Are you sure you want to completely delete this workspace and all its data?')) return;
    try {
      const res = await api.delete('/api/repos/delete', { data: { url } });
      if (res.status === 200) {
        if (selectedRepo === url) {
          setSelectedRepo(null);
          if (onDeleted) onDeleted();
        }
        fetchIndexedRepos();
      } else {
        alert('Failed to delete workspace');
      }
    } catch (e) {
      console.error('Failed to delete workspace', e);
    }
  };

  const analyzeRepo = async (e?: React.FormEvent | null, targetUrl: string | null = null) => {
    if (e) e.preventDefault();
    const urlToAnalyze = targetUrl || repoUrl;
    if (!urlToAnalyze) return;

    setIsIndexing(true);
    setIndexProgress({ status: 'fetching', repoUrl: urlToAnalyze });
    setIndexError(null);
    setRepoAnalysis(null);

    try {
      const response = await api.post('/api/repos/analyze', { url: urlToAnalyze });
      if (response.status !== 200) throw new Error('Failed to analyze repository');

      setRepoAnalysis(response.data);
      setIsIndexing(false);
      setIndexProgress(null);
    } catch (e: any) {
      console.error('Failed to analyze repository', e);
      setIndexError(e.message || 'Failed to analyze repository');
      setIsIndexing(false);
      setIndexProgress(null);
    }
  };

  const indexRepo = async (e?: React.FormEvent | null, targetUrl: string | null = null, excludedExtensions: string[] | null = null, onComplete?: () => void) => {
    if (e) e.preventDefault();
    const urlToIndex = targetUrl || repoUrl;
    if (!urlToIndex) return;

    setRepoAnalysis(null);
    setIsIndexing(true);
    setIndexProgress({ status: 'starting', repoUrl: urlToIndex });
    setIndexError(null);

    try {
      const payload: any = { url: urlToIndex, embeddingModel };
      if (excludedExtensions !== null) {
        payload.excludedExtensions = excludedExtensions;
      }

      const response = await api.post('/api/repos/index', payload);
      if (response.status !== 200) {
        const errData = response.data || {};
        throw new Error(errData.error || 'Failed to start indexing');
      }

      const poll = async () => {
        try {
          const statusRes = await api.get(`/api/repos/status?url=${encodeURIComponent(urlToIndex)}`);
          if (statusRes.status !== 200) throw new Error('Status check failed');
          const data = statusRes.data;

          if (data.status === 'complete') {
            setIsIndexing(false);
            setRepoUrl('');
            setIndexProgress(null);
            fetchIndexedRepos();
            if (onComplete) onComplete();
            return;
          }

          if (data.status === 'error') {
            setIndexError(data.error || 'Indexing failed. Click Resume to try again.');
            setIsIndexing(false);
            setIndexProgress(null);
            fetchIndexedRepos();
            return;
          }

          if (data.status === 'paused') {
            setIsIndexing(false);
            setIndexProgress(null);
            fetchIndexedRepos();
            return;
          }

          setIndexProgress({
            status: data.status,
            repoUrl: urlToIndex,
            current: data.indexedFiles || 0,
            total: data.totalFiles || 0,
            file: data.currentFile || '',
            isWaiting: data.status === 'quota_wait',
            waitTime: data.waitTime || 60000,
            message: data.status === 'quota_wait'
              ? `⏳ Rate limit hit — waiting for API quota to reset...`
              : `Indexing files... (${data.indexedFiles || 0}/${data.totalFiles || 0})`,
          });

          setTimeout(poll, data.status === 'quota_wait' ? 5000 : 2000);
        } catch (pollErr) {
          console.error('Polling error:', pollErr);
          setIndexError('Lost connection to server. Check if backend is running.');
          setIsIndexing(false);
          setIndexProgress(null);
        }
      };

      setTimeout(poll, 1500);
    } catch (err: any) {
      console.error(err);
      setIndexError(err.message || 'Failed to start indexing. Is the backend running?');
      setIsIndexing(false);
      setIndexProgress(null);
    }
  };

  return {
    repoUrl,
    setRepoUrl,
    isIndexing,
    setIsIndexing,
    indexProgress,
    setIndexProgress,
    indexedRepos,
    setIndexedRepos,
    selectedRepo,
    setSelectedRepo,
    indexError,
    setIndexError,
    isSkippingFile,
    repoAnalysis,
    setRepoAnalysis,
    fetchIndexedRepos,
    pauseIndexing,
    skipCurrentFile,
    deleteWorkspace,
    analyzeRepo,
    indexRepo,
  };
}
