import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';

import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { useProducts } from '../hooks/api/useProducts';
import { FilterOptions, Product } from '../types';
import { Filter, Grid, List } from 'lucide-react';
import { Hero } from '../components/Hero';

interface HomePageProps {
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
    hasMore: false
  });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    ageGroup: 'All',
    gender: 'All',
    priceRange: [0, 5000],
    sortBy: 'featured'
  });
  
  const { getPaginatedProducts } = useProducts();
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async (page: number = 1, filtersToApply: Partial<FilterOptions> = {}, loadMore: boolean = false) => {
    console.log('Fetching products - Page:', page, 'Load more:', loadMore);
    
    // Update loading states immediately
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      // Use filters directly since we're already merging in the function parameters

      const apiFilters: any = {};
      
      if (filtersToApply.category !== 'All') apiFilters.category = filtersToApply.category;
      if (filtersToApply.ageGroup !== 'All') apiFilters.ageGroup = filtersToApply.ageGroup;
      if (filtersToApply.gender !== 'All') apiFilters.gender = filtersToApply.gender;
      if (filtersToApply.sortBy && filtersToApply.sortBy !== 'featured') {
        apiFilters.sortBy = filtersToApply.sortBy;
        apiFilters.sortOrder = 'desc';
      }
      if (filtersToApply.priceRange) {
        apiFilters.price = {min:filtersToApply.priceRange[0],max:filtersToApply.priceRange[1]};
        
      }

      const response = await getPaginatedProducts(page, pagination.pageSize, apiFilters);
      
      const data = response.data || response?.products;
      
      setProducts(prev => loadMore ? [...prev, ...data] : data);
      
      // setSkip(prev => loadMore ? prev + pagination.pageSize : pagination.pageSize);
      const hasMore = data.length === pagination.pageSize;
      console.log('Fetch complete - Page:', page, 'Items received:', data.length, 'Has more:', hasMore);
      
      setPagination(prev => ({
        ...prev,
        page,
        total: response.total,
        totalPages: response.totalPages,
        hasMore
      }));
      
      return response;
    } catch (err) {
      console.error('Error fetching products:', err);
      throw err;
    } finally {
      if (loadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [getPaginatedProducts]); // Only depend on getPaginatedProducts

  // Initial load and when filters change
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) {
      console.log('No observer target found');
      return;
    }
    
    let isMounted = true;

    console.log('Setting up intersection observer');
    console.log('Current page:', pagination.page, 'Has more:', pagination.hasMore);

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log('Intersection entry:', entry.isIntersecting);
        
        if (entry.isIntersecting && isMounted) {
          setPagination(prev => {
            if (prev.hasMore && !isLoadingMore && !isLoading) {
              console.log('Loading more products...');
              fetchProducts(prev.page + 1, filters, true);
              return { ...prev };
            }
            return prev;
          });
        }
      },
      { 
        root: null,
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    observer.observe(target);
    console.log('Observer attached to target');
    
    return () => {
      console.log('Cleaning up observer');
      isMounted = false;
      observer.unobserve(target);
    };
  }, [filters, pagination, isLoadingMore, isLoading, fetchProducts]);

  // Initial load and when filters change
  useEffect(() => {
    console.log('Filters changed, resetting products and pagination');
    let isMounted = true;
    
    const loadInitialProducts = async () => {
      setProducts([]);
      setPagination(prev => ({
        ...prev,
        page: 1,
        hasMore: true
      }));
      
      try {
        await fetchProducts(1, filters);
        // Smooth scroll to top when filters change
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadInitialProducts();
    
    return () => {
      isMounted = false;
    };
  }, [filters]); // Remove fetchProducts from dependencies

  // Handle search by updating filters
  useEffect(() => {
    if (searchQuery) {
      setFilters(prev => ({
        ...prev,
        search: searchQuery
      }));
    } else {
      setFilters(prev => {
        const { search, ...rest } = prev;
        return rest as FilterOptions;
      });
    }
  }, [searchQuery]);

  // Client-side filtering for search since we want instant feedback
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter(product => {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.category.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [products, searchQuery]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-gray-50">
         {/* Hero Section - Only show when no search query */}
          {!searchQuery && <Hero />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 transition-all duration-300 ease-in-out">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mb-4 w-max"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Main Content */}
          <div className="flex-1 w-full lg:pl-0 transition-all duration-300 ease-in-out">
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} - {
                  Math.min(pagination.page * pagination.pageSize, pagination.total)
                } of {pagination.total} products
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchProducts(pagination.page - 1, filters)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg border ${pagination.page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchProducts(pageNum, filters)}
                        className={`w-10 h-10 rounded-lg ${pagination.page === pageNum 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                </div>
                <button
                  onClick={() => fetchProducts(pagination.page + 1, filters)}
                  disabled={!pagination.hasMore}
                  className={`px-4 py-2 rounded-lg border ${!pagination.hasMore 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
                  </h2>
                  <p className="text-gray-600">{filteredProducts.length} products found</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="relative">
              {isLoading && !isLoadingMore ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="space-y-6">
                  <div className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}>
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>
                  
                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                  
                  {/* Observer target for infinite scroll */}
                  <div 
                    ref={pagination.hasMore ? observerTarget : null} 
                    className="h-10 w-full"
                    style={{ background: 'rgba(255,0,0,0.1)' }}
                  >
                    {pagination.hasMore && 'Scroll to load more'}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <span className="text-6xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                  <button
                    onClick={() => setFilters({
                      category: 'All',
                      ageGroup: 'All',
                      gender: 'All',
                      priceRange: [0, 5000],
                      sortBy: 'featured'
                    })}
                    className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};