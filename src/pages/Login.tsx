import React from 'react';
import LoginForm from '../components/Login/LoginForm';
import { DataProvider } from '../context/UserDataContext';

const Login: React.FC = () => {
    return (
        <DataProvider>
            <LoginForm />
        </DataProvider>
       
    );
};

export default Login;
