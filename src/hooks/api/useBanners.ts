import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from './apiConfig';

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  type: 'hero' | 'promo_banner' | 'sidebar_banner';
  position: 'top' | 'middle' | 'bottom';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BannerFilters {
  type?: string;
  position?: string;
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const useBanners = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBanners = useCallback(async (filters: BannerFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, any> = {
        type: filters.type,
        position: filters.position,
        isActive: filters.isActive,
        page: filters.page,
        limit: filters.limit,
        tags: filters.tags
      };
      
      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });
      
      const response = await apiGet<{ data: Banner[]; pagination: any }>('/banners', queryParams);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch banners';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getActiveBanners = useCallback(async (type?: string, position?: string, tags?: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, any> = {
        type,
        position,
        tags
      };
      
      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });
      
      const response = await apiGet<{ data: Banner[] }>('/banners/active', queryParams);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active banners';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBannerById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<{ data: Banner }>(`/banners/${id}`);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBanner = useCallback(async (id: string, bannerData: Partial<Banner>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPut<{ data: Banner }>(`/banners/${id}`, bannerData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBanner = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(`/banners/${id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBannerStatus = useCallback(async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPatch<{ data: Banner }>(
        `/banners/${id}/status`,
        { isActive }
      );
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update banner status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBanner = useCallback(async (bannerData: Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiPost<{ data: Banner }>('/banners', bannerData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getBanners,
    getActiveBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
  };
};

export default useBanners;
