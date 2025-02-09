import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ProfileUser from '../components/Profile/profileuser';
import { DataProvider } from '../context/UserDataContext';

const Profile: React.FC = () => {

    return (
        <DataProvider>
            <ProfileUser />
        </DataProvider>
        
    );
};

export default Profile;
