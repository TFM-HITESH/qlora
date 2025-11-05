
interface GPUAdapter {
  name: string;
  requestAdapterInfo(): Promise<GPUAdapterInfo>;
}

interface GPUAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

/**
 * Tracks GPU usage by leveraging a hypothetical performance observer.
 * @param callback - A callback function to handle GPU usage data.
 * @returns A PerformanceObserver instance to disconnect when no longer needed.
 */
export const trackGpuUsage = (callback: (usage: any) => void): PerformanceObserver => {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        callback(entry);
      });
    });

    // 'gpu-usage' is a hypothetical entry type
    observer.observe({ type: 'gpu-usage', buffered: true });

    console.log('Started tracking GPU usage.');
    return observer;
  } catch (error) {
    console.error('Error tracking GPU usage:', error);
    throw new Error('Failed to track GPU usage');
  }
};

/**
 * Retrieves information about the GPU adapter.
 * @returns A promise that resolves with GPU adapter information.
 */
export const getGpuInfo = async (): Promise<GPUAdapterInfo | null> => {
  try {
    if (!('gpu' in navigator)) {
      console.warn('WebGPU API not supported.');
      return null;
    }
    const adapter = await (navigator as any).gpu.requestAdapter();
    if (!adapter) {
      console.warn('No GPU adapter found.');
      return null;
    }
    const info = await adapter.requestAdapterInfo();
    return info;
  } catch (error) {
    console.error('Error getting GPU info:', error);
    throw new Error('Failed to get GPU info');
  }
};
