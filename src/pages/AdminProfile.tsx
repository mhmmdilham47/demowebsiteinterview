import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import ProfileUser from '../components/Profile/profileuser';
import ProfileAdmin from '../components/Admin/Profile/AdminProfile';

const AdminProfilePages: React.FC = () => {

    return (
        <ProfileAdmin/>
    );
};

export default AdminProfilePages;