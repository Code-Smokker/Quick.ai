import React from 'react';
import { Outlet } from 'react-router-dom';
import { AGCRProvider } from '../../context/AGCRContext';

const AGCRLayout = () => {
    return (
        <AGCRProvider>
            <Outlet />
        </AGCRProvider>
    );
};

export default AGCRLayout;
