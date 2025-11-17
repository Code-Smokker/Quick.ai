import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import WriteArticle from './pages/WriteArticle';
import BolgTitles from './pages/BolgTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveObject from './pages/RemoveObject';
import ReviewResume from './pages/ReviewResume';
import Community from './pages/community';
import DashBoard from './pages/DashBoard';
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
            <Route path='remove-object' element={<RemoveObject />} />
            <Route path='review-resume' element={<ReviewResume />} />
            <Route
              path='reviwe-resume'
              element={<Navigate to='/ai/review-resume' replace />}
            />
            
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