import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { DataProvider } from '../context/UserDataContext';
import ListUser from '../components/ListContact/ListUser';

const ListContact: React.FC = () => {

    return (
        <DataProvider>
            <ListUser />
        </DataProvider> 
    );
};

export default ListContact;
