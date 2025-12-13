// // src/App.tsx
// import React, { useState } from 'react';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import ComparisonTable from './components/ComparisonTable';
// import { ComparisonResponse, SelectionState } from './types';
// import { fetchComparisonDetails } from './services/api';

// const App: React.FC = () => {
//   const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleCompare = async (sel1: SelectionState, sel2: SelectionState) => {
//     setIsLoading(true);
//     setComparisonData(null);
//     try {
//       const data = await fetchComparisonDetails(sel1, sel2);
//       setComparisonData(data);
//     } catch (error) {
//       console.error('Error fetching comparison details:', error);
//       alert('Failed to fetch comparison details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-sky-50 overflow-hidden font-sans text-slate-900">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar onCompare={handleCompare} isLoading={isLoading} />
//         <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 relative">
//           <div className="max-w-6xl mx-auto pb-10">
//             <div className="mb-4 md:mb-6">
//               <h2 className="text-2xl font-bold text-slate-900">Comparison Result</h2>
//               <p className="text-sm text-slate-500">
//                 Detailed breakdown of features and specifications.
//               </p>
//             </div>

//             {isLoading && (
//               <div className="absolute inset-0 bg-sky-50/70 backdrop-blur-sm z-20 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
//                   <p className="text-blue-700 font-semibold text-sm">
//                     Fetching comparison data...
//                   </p>
//                 </div>
//               </div>
//             )}

//             <ComparisonTable data={comparisonData} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;


// // src/App.tsx
// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import ComparisonTable from './components/ComparisonTable';
// import NewsSection from './components/NewsSection';
// import { ComparisonResponse, SelectionState, NewsResponse } from './types';
// import { fetchComparisonDetails, fetchCarNews } from './services/api';

// const App: React.FC = () => {
//   const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // News state
//   const [news1, setNews1] = useState<NewsResponse | null>(null);
//   const [news2, setNews2] = useState<NewsResponse | null>(null);
//   const [isLoadingNews, setIsLoadingNews] = useState(false);
  
//   // Track current selections to fetch news
//   const [currentSel1, setCurrentSel1] = useState<SelectionState | null>(null);
//   const [currentSel2, setCurrentSel2] = useState<SelectionState | null>(null);

//   // Fetch news whenever models are selected (not variants)
//   useEffect(() => {
//     const fetchNews = async () => {
//       // Only fetch if both models are selected
//       if (!currentSel1?.model || !currentSel2?.model) {
//         setNews1(null);
//         setNews2(null);
//         return;
//       }

//       setIsLoadingNews(true);
//       try {
//         // Fetch news for both models in parallel
//         const [newsData1, newsData2] = await Promise.all([
//           fetchCarNews(currentSel1.model),
//           fetchCarNews(currentSel2.model),
//         ]);
        
//         setNews1(newsData1);
//         setNews2(newsData2);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//         // Don't show alert for news failures, just log it
//         setNews1(null);
//         setNews2(null);
//       } finally {
//         setIsLoadingNews(false);
//       }
//     };

//     fetchNews();
//   }, [currentSel1?.model, currentSel2?.model]);

//   const handleCompare = async (sel1: SelectionState, sel2: SelectionState) => {
//     // Update current selections
//     setCurrentSel1(sel1);
//     setCurrentSel2(sel2);
    
//     // Fetch comparison data
//     setIsLoading(true);
//     setComparisonData(null);
//     try {
//       const data = await fetchComparisonDetails(sel1, sel2);
//       setComparisonData(data);
//     } catch (error) {
//       console.error('Error fetching comparison details:', error);
//       alert('Failed to fetch comparison details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-sky-50 overflow-hidden font-sans text-slate-900">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar onCompare={handleCompare} isLoading={isLoading} />
//         <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 relative">
//           <div className="max-w-6xl mx-auto pb-10">
//             <div className="mb-4 md:mb-6">
//               <h2 className="text-2xl font-bold text-slate-900">Comparison Result</h2>
//               <p className="text-sm text-slate-500">
//                 Detailed breakdown of features and specifications.
//               </p>
//             </div>

//             {isLoading && (
//               <div className="absolute inset-0 bg-sky-50/70 backdrop-blur-sm z-20 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
//                   <p className="text-blue-700 font-semibold text-sm">
//                     Fetching comparison data...
//                   </p>
//                 </div>
//               </div>
//             )}

//             <ComparisonTable data={comparisonData} />
            
//             {/* News Section - Shows when models are selected */}
//             <NewsSection 
//               news1={news1} 
//               news2={news2} 
//               isLoading={isLoadingNews}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;



// // src/App.tsx
// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import ComparisonTable from './components/ComparisonTable';
// import NewsButtonCards from './components/NewsButtonCards';
// import { ComparisonResponse, SelectionState, NewsResponse } from './types';
// import { fetchComparisonDetails, fetchCarNews } from './services/api';

// const App: React.FC = () => {
//   const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // News state
//   const [news1, setNews1] = useState<NewsResponse | null>(null);
//   const [news2, setNews2] = useState<NewsResponse | null>(null);
//   const [isLoadingNews, setIsLoadingNews] = useState(false);
  
//   // Track current selections to fetch news
//   const [currentSel1, setCurrentSel1] = useState<SelectionState | null>(null);
//   const [currentSel2, setCurrentSel2] = useState<SelectionState | null>(null);

//   // Fetch news whenever models are selected (not variants)
//   useEffect(() => {
//     const fetchNews = async () => {
//       // Only fetch if both models are selected
//       if (!currentSel1?.model || !currentSel2?.model) {
//         setNews1(null);
//         setNews2(null);
//         return;
//       }

//       setIsLoadingNews(true);
//       try {
//         // Fetch news for both models in parallel
//         const [newsData1, newsData2] = await Promise.all([
//           fetchCarNews(currentSel1.model),
//           fetchCarNews(currentSel2.model),
//         ]);
        
//         setNews1(newsData1);
//         setNews2(newsData2);
//       } catch (error) {
//         console.error('Error fetching news:', error);
//         setNews1(null);
//         setNews2(null);
//       } finally {
//         setIsLoadingNews(false);
//       }
//     };

//     fetchNews();
//   }, [currentSel1?.model, currentSel2?.model]);

//   const handleCompare = async (sel1: SelectionState, sel2: SelectionState) => {
//     // Update current selections
//     setCurrentSel1(sel1);
//     setCurrentSel2(sel2);
    
//     // Fetch comparison data
//     setIsLoading(true);
//     setComparisonData(null);
//     try {
//       const data = await fetchComparisonDetails(sel1, sel2);
//       setComparisonData(data);
//     } catch (error) {
//       console.error('Error fetching comparison details:', error);
//       alert('Failed to fetch comparison details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-sky-50 overflow-hidden font-sans text-slate-900">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar onCompare={handleCompare} isLoading={isLoading} />
//         <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 relative">
//           <div className="max-w-6xl mx-auto pb-10">
//             {/* News Buttons - Top of page */}
//             <NewsButtonCards 
//               news1={news1} 
//               news2={news2} 
//               isLoading={isLoadingNews}
//             />

//             <div className="mb-4 md:mb-6">
//               <h2 className="text-2xl font-bold text-slate-900">Comparison Result</h2>
//               <p className="text-sm text-slate-500">
//                 Detailed breakdown of features and specifications.
//               </p>
//             </div>

//             {isLoading && (
//               <div className="absolute inset-0 bg-sky-50/70 backdrop-blur-sm z-20 flex items-center justify-center">
//                 <div className="flex flex-col items-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
//                   <p className="text-blue-700 font-semibold text-sm">
//                     Fetching comparison data...
//                   </p>
//                 </div>
//               </div>
//             )}

//             <ComparisonTable data={comparisonData} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;


// src/App.tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComparisonTable from './components/ComparisonTable';
import NewsButtonCards from './components/NewsButtonCards';
import LoginPage from './components/LoginPage';
import { ComparisonResponse, SelectionState, NewsResponse } from './types';
import { fetchComparisonDetails, fetchCarNews } from './services/api';

const App: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (session storage)
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // News state
  const [news1, setNews1] = useState<NewsResponse | null>(null);
  const [news2, setNews2] = useState<NewsResponse | null>(null);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  
  // Track current selections to fetch news
  const [currentSel1, setCurrentSel1] = useState<SelectionState | null>(null);
  const [currentSel2, setCurrentSel2] = useState<SelectionState | null>(null);

  // Fetch news whenever models are selected (not variants)
  useEffect(() => {
    const fetchNews = async () => {
      // Only fetch if both models are selected
      if (!currentSel1?.model || !currentSel2?.model) {
        setNews1(null);
        setNews2(null);
        return;
      }

      setIsLoadingNews(true);
      try {
        // Fetch news for both models in parallel
        const [newsData1, newsData2] = await Promise.all([
          fetchCarNews(currentSel1.model),
          fetchCarNews(currentSel2.model),
        ]);
        
        setNews1(newsData1);
        setNews2(newsData2);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews1(null);
        setNews2(null);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNews();
  }, [currentSel1?.model, currentSel2?.model]);

  const handleCompare = async (sel1: SelectionState, sel2: SelectionState) => {
    // Update current selections
    setCurrentSel1(sel1);
    setCurrentSel2(sel2);
    
    // Fetch comparison data
    setIsLoading(true);
    setComparisonData(null);
    try {
      const data = await fetchComparisonDetails(sel1, sel2);
      setComparisonData(data);
    } catch (error) {
      console.error('Error fetching comparison details:', error);
      alert('Failed to fetch comparison details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show dashboard if authenticated
  return (
    <div className="flex flex-col h-screen bg-sky-50 overflow-hidden font-sans text-slate-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCompare={handleCompare} isLoading={isLoading} />
        <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10 relative">
          <div className="max-w-6xl mx-auto pb-10">
            {/* News Buttons - Top of page */}
            <NewsButtonCards 
              news1={news1} 
              news2={news2} 
              isLoading={isLoadingNews}
            />

            <div className="mb-4 md:mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Comparison Result</h2>
              <p className="text-sm text-slate-500">
                Detailed breakdown of features and specifications.
              </p>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-sky-50/70 backdrop-blur-sm z-20 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                  <p className="text-blue-700 font-semibold text-sm">
                    Fetching comparison data...
                  </p>
                </div>
              </div>
            )}

            <ComparisonTable data={comparisonData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;