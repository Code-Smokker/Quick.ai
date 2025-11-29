import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import WriteArticle from './pages/WriteArticle';
import BolgTitles from './pages/BolgTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveObject from './pages/RemoveObject';
import ReviewResume from './pages/ReviewResume';
import DashBoard from './pages/DashBoard';
import BannerGenerator from './pages/BannerGenerator';
import { AGCRPage } from './pages/AGCRPage';
import VideoScript from './pages/agcr/VideoScript';
import TitlesSEO from './pages/agcr/TitlesSEO';
import ImagePrompts from './pages/agcr/ImagePrompts';
import AdCopy from './pages/agcr/AdCopy';
import AGCRLayout from './pages/agcr/AGCRLayout';
import { useAuth } from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { isSignedIn } = useAuth();

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />

        {isSignedIn ? (
          <Route path='ai' element={<Layout />}>
            <Route path='dashboard' element={<DashBoard />} />
            <Route path='write-article' element={<WriteArticle />} />
            <Route path='blog-titles' element={<BolgTitles />} />
            <Route path='generate-images' element={<GenerateImages />} />
            <Route path='banner-generator' element={<BannerGenerator />} />
            <Route path='remove-object' element={<RemoveObject />} />
            <Route path='review-resume' element={<ReviewResume />} />
            <Route
              path='reviwe-resume'
              element={<Navigate to='/ai/review-resume' replace />}
            />

            {/* AGCR Routes */}
            <Route element={<AGCRLayout />}>
              <Route path='agcr-engine' element={<AGCRPage />} />
              <Route path='agcr/video' element={<VideoScript />} />
              <Route path='agcr/titles' element={<TitlesSEO />} />
              <Route path='agcr/images' element={<ImagePrompts />} />
              <Route path='agcr/ads' element={<AdCopy />} />
            </Route>

          </Route>
        ) : (
          <Route path='ai/*' element={<Navigate to='/' replace />} />
        )}

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
};

export default App;