import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/user/get-published-creations', {
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${await getToken()}` })
        },
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      if (response.data.success) {
        setCreations(Array.isArray(response.data.creations) ? response.data.creations : []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch creations');
      }
    } catch (error) {
      console.error('Error fetching creations:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      setError(error.response?.data?.message || error.message || 'Failed to load creations');
      toast.error(error.response?.data?.message || 'An error occurred while fetching creations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00DA83]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-red-500 text-lg font-medium">Error Loading Creations</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchCreations}
          className="px-4 py-2 bg-[#00DA83] text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full flex-col gap-4 p-6 text-slate-200">
      <h1 className="text-2xl font-bold text-white">Community Creations</h1>

      {creations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No creations found. Be the first to create something!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation) => (
            <div
              key={creation.id}
              className="bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-700 hover:border-slate-600"
            >
              <div className="p-4">
                <p className="text-slate-300 mb-2">{creation.prompt || 'No prompt provided'}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      {Array.isArray(creation.likes) ? creation.likes.length : 0}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(creation.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;