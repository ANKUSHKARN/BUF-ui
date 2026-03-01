'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [apiStatus, setApiStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  // Get API URL from environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        // Try multiple times with retry logic
        let retries = 3;
        let lastError = null;

        while (retries > 0) {
          try {
            console.log('Checking backend health at:', `${API_BASE_URL}/health`);
            
            const response = await fetch(`${API_BASE_URL}/health`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              console.log('Backend health check successful:', data);
              setApiStatus('success');
              
              // Redirect to login after successful API response
              setTimeout(() => {
                router.push('/login');
              }, 1000); // Small delay to show 100% progress
              
              return;
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          } catch (error) {
            lastError = error;
            retries--;
            if (retries > 0) {
              console.log(`Retrying... ${retries} attempts left`);
              // Wait 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }

        // If all retries failed
        throw lastError || new Error('Failed to connect to backend');
        
      } catch (error) {
        console.error('Backend health check failed:', error);
        setApiStatus('error');
        setErrorMessage('Unable to connect to server. Please try again.');
      }
    };

    checkBackendHealth();
  }, [router, API_BASE_URL]);

  useEffect(() => {
    // Animate progress based on API status
    let currentProgress = 0;
    let interval: NodeJS.Timeout;

    if (apiStatus === 'checking') {
      // Slow progress while checking API (up to 90%)
      interval = setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress >= 90) {
          setProgress(90);
          clearInterval(interval);
        } else {
          setProgress(currentProgress);
        }
      }, 100);
    } else if (apiStatus === 'success') {
      // Quick progress to 100% on success
      interval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(interval);
        } else {
          setProgress(currentProgress);
        }
      }, 20);
    } else if (apiStatus === 'error') {
      // Show error state at 65%
      setProgress(65);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiStatus]);

  const handleRetry = () => {
    setApiStatus('checking');
    setProgress(0);
    setErrorMessage('');
    
    // Trigger health check again
    const checkBackendHealth = async () => {
      try {
        console.log('Retrying connection to:', `${API_BASE_URL}/health`);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Backend health check successful:', data);
          setApiStatus('success');
          
          setTimeout(() => {
            router.push('/login');
          }, 1000);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setApiStatus('error');
        setErrorMessage('Unable to connect to server. Please try again.');
      }
    };

    checkBackendHealth();
  };

  return (
    <div className="dark">
      <div className="relative flex min-h-screen w-full flex-col bg-[#101622] overflow-x-hidden font-[Manrope,sans-serif] antialiased">
        {/* Geometric Background Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(19, 91, 236, 0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-4 sm:px-6 py-12 sm:py-16">
          
          {/* Top App Bar / Brand Header */}
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="text-[#135bec] w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-slate-100 text-lg sm:text-xl font-extrabold tracking-tight">
                UNITY
              </h1>
            </div>
          </div>
          
          {/* Central Emblem Section */}
          <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#135bec]/30 blur-[40px] sm:blur-[60px] rounded-full" />
              
              {/* Shield/Unity Emblem */}
              <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 bg-slate-800/80 rounded-full border border-[#135bec]/30 shadow-2xl backdrop-blur-sm">
                <Users className="text-[#135bec] w-16 h-16 sm:w-20 sm:h-20" />
              </div>
            </div>
            
            <div className="text-center space-y-1 sm:space-y-2">
              <h2 className="text-slate-100 text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                Brother's Unity
              </h2>
              <p className="text-[#135bec] text-base sm:text-lg font-medium tracking-wide">
                Strength in Unity
              </p>
            </div>
          </div>
          
          {/* Footer / Loading Section */}
          <div className="w-full max-w-[280px] sm:max-w-xs space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-slate-400 text-xs sm:text-sm font-medium">
                  {apiStatus === 'checking' && 'Checking backend connection...'}
                  {apiStatus === 'success' && 'Backend connected! Redirecting...'}
                  {apiStatus === 'error' && 'Connection failed'}
                </p>
                <p className="text-[#135bec] text-xs sm:text-sm font-bold">{Math.round(progress)}%</p>
              </div>
              
              {/* Loading Bar Component */}
              <div className="h-1.5 sm:h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    apiStatus === 'error' ? 'bg-red-500' : 'bg-[#135bec]'
                  }`}
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: apiStatus === 'error' 
                      ? '0 0 12px rgba(239, 68, 68, 0.5)' 
                      : '0 0 12px rgba(19, 91, 236, 0.5)'
                  }}
                />
              </div>
              
              {/* Status Message */}
              {apiStatus === 'checking' && (
                <p className="text-center text-slate-500 text-xs mt-2">
                  Connecting to secure server...
                </p>
              )}
              
              {apiStatus === 'success' && (
                <p className="text-center text-green-500 text-xs mt-2">
                  {/* Server connected successfully! */}
                </p>
              )}
              
              {apiStatus === 'error' && (
                <div className="text-center mt-2">
                  <p className="text-red-500 text-xs mb-2">
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-[#135bec] text-white text-xs rounded-lg hover:bg-[#135bec]/80 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              )}
            </div>
            
            {/* Subtle Community Note */}
            <p className="text-slate-600 text-[8px] sm:text-[10px] text-center uppercase tracking-[0.2em] font-bold">
              A Shared Legacy of Trust
            </p>
          </div>
        </div>
        
        {/* Decorative Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#135bec]/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}