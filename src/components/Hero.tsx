import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBanners } from '../hooks/api/useBanners';

export const Hero: React.FC = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { getActiveBanners, loading, error } = useBanners();
  const [banners, setBanners] = useState<Array<{
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    linkUrl?: string;
    buttonText?: string;
  }>>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch only active hero banners
        const response = await getActiveBanners('hero', 'top');
        if (response && response.data && response.data.length > 0) {
          setBanners(response.data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
  }, [getActiveBanners]);

  // Auto-rotate banners every 8 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevBanner = () => {
    setCurrentBannerIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // Show loading state
  if (loading && banners.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden h-[600px] flex items-center justify-center">
        <div className="animate-pulse text-center space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
          <div className="h-12 w-3/4 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && banners.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden h-[600px] flex items-center justify-center">
        <div className="text-center text-red-600 p-4">
          <p>Failed to load banners. Please try again later.</p>
        </div>
      </div>
    );
  }

  // If no banners, show default content
  if (banners.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden">
        {/* Background decorative elements with pointer-events-none */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-red-400 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 border-4 border-orange-400 rounded-lg rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    Premium Kids Fashion
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Beautiful
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {" "}Indian{" "}
                  </span>
                  Wear for Kids
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Discover our exquisite collection of traditional and contemporary clothing 
                  designed specially for Indian children. From vibrant festival wear to 
                  comfortable everyday outfits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link
                  to="/shop"
                  className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/default-hero.jpg"
                alt="Kids Fashion"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://github.com/Chandu8817/ecommerce-backend/blob/main/demo-images/navrarti-banner.jpg?raw=true';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show dynamic banner content
  const currentBanner = banners[currentBannerIndex];
  const hasMultipleBanners = banners.length > 1;

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center opacity-10"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative">
        {/* Navigation Arrows */}
        {hasMultipleBanners && (
          <>
            <button
              onClick={goToPrevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all shadow-lg"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-all shadow-lg"
              aria-label="Next banner"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              {currentBanner.subtitle && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">
                    {currentBanner.subtitle}
                  </span>
                </div>
              )}
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {currentBanner.title}
              </h1>
              
              {currentBanner.description && (
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  {currentBanner.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={currentBanner.linkUrl || '/shop'}
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {currentBanner.buttonText || 'Shop Now'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/traditional"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-full hover:bg-orange-50 transition-colors"
              >
                Traditional Wear
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">10k+</div>
                <div className="text-sm text-gray-600">Happy Kids</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.8★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/8088473/pexels-photo-8088473.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beautiful Indian kids clothing"
                className="w-full h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="text-sm font-semibold">Festival Ready</div>
                    <div className="text-xs text-gray-500">Special Collection</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <div className="text-sm font-semibold">Premium Quality</div>
                    <div className="text-xs text-gray-500">Comfort Guaranteed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};