import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AGCRContext = createContext();

export const useAGCR = () => useContext(AGCRContext);

export const AGCRProvider = ({ children }) => {
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [topic, setTopic] = useState(() => localStorage.getItem('agcr_topic') || '');
    const [videoStyle, setVideoStyle] = useState(() => localStorage.getItem('agcr_video_style') || 'Professional');
    const [voiceFile, setVoiceFile] = useState(null); // Files cannot be persisted in localStorage easily
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(() => {
        const saved = localStorage.getItem('agcr_result');
        return saved ? JSON.parse(saved) : null;
    });

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    React.useEffect(() => {
        localStorage.setItem('agcr_topic', topic);
    }, [topic]);

    React.useEffect(() => {
        localStorage.setItem('agcr_video_style', videoStyle);
    }, [videoStyle]);

    React.useEffect(() => {
        if (result) {
            localStorage.setItem('agcr_result', JSON.stringify(result));
        }
    }, [result]);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get('/api/ai/history/agcr', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setHistoryLoading(false);
        }
    };

    const loadHistoryItem = (item) => {
        try {
            const content = JSON.parse(item.content);
            setResult(content);
            setTopic(item.prompt);
            toast.success('History loaded!');
            navigate('/ai/agcr/video');
        } catch (error) {
            console.error('Failed to parse history item:', error);
            toast.error('Failed to load history item');
        }
    };

    const generateContent = async () => {
        if (!topic) {
            toast.error('Please enter a topic');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('topic', `${topic} (Video Style: ${videoStyle})`);
            if (voiceFile) formData.append('voice', voiceFile);
            imageFiles.forEach(file => formData.append('images', file));

            const response = await axios.post('/api/ai/generate-agcr', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setResult(response.data.content);
                toast.success('Content generated successfully!');
                fetchHistory(); // Refresh history
                navigate('/ai/agcr/video');
            } else {
                toast.error(response.data.message || 'Failed to generate content');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const value = {
        topic,
        setTopic,
        videoStyle, setVideoStyle,
        voiceFile,
        setVoiceFile,
        imageFiles,
        setImageFiles,
        loading,
        result,
        history,
        fetchHistory,
        loadHistoryItem,
        loadHistoryItem,
        generateContent,
        historyLoading
    };

    return (
        <AGCRContext.Provider value={value}>
            {children}
        </AGCRContext.Provider>
    );
};
