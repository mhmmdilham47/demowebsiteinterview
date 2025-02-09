import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { User } from '../../context/UserDataContext';
import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/UserDataContext';
import { getUserType } from '../Login/LoginForm';
import { getUsersByRole } from '../../firebase/UsersHandling';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Tooltip, IconButton, Button, MenuItem } from '@mui/material';
import TableUser from './TableUser/TableUser';
import TableConsult from './TableKonseling/TableConsult';
import NotFound from '../../pages/NotFoundPage';

const TableAdmin: React.FC = () => {
    const [dataUserAdmin, setDataUserAdmin] = useState<any | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        
        if(storedUserData){
          const data = JSON.parse(storedUserData);
          console.log("data user from localStorage: ", data);
          setDataUserAdmin(data);
        }else{
           // mengarah ke halaman notFound
           setDataUserAdmin(null);
        }
    }, []);
    
    return (
        <>
        {!dataUserAdmin||dataUserAdmin.role!=='Admin' ? (
            <NotFound />
        ):(
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton autoHide={false}/>
                    </IonButtons>
                    <IonTitle className='ion-text-center'>All Table</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
                <TableUser />
                <TableConsult/>
            </IonContent>
        </IonPage>
        )}
        </>
    );
};

export default TableAdmin;