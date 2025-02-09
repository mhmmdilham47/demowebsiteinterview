import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState, useMemo } from 'react';
import './ListUser.css'
import { informationCircle, informationOutline, trashOutline } from 'ionicons/icons';
import { DataProvider, User, useData } from '../../context/UserDataContext';
import { getUserType } from '../Login/LoginForm';
import {
    MaterialReactTable,
    // createRow,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMaterialReactTable,
  } from 'material-react-table';
import { getUsersByIDReturnUID, getUsersByRole } from '../../firebase/UsersHandling';
import { DocumentData } from 'firebase/firestore';
import { Box, Tooltip, IconButton, Button, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateModal } from './CreateModal';
import { DetailUserModal } from './DetailUser';
import { UpdateUserModal } from './UpdateUser';
import { AlertDeleteUser } from './AlertDeleteUser';
import NotFound from '../../pages/NotFoundPage';

const UserList: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState('Dosen');
    const [userType, setUserType] = useState('');
    const { dataDosen, setDataDosen, dataMahasiswa, setDataMahasiswa, dataAdmin, setDataAdmin, getAllData } = useData();
    const [datausers, setDatausers ] = useState<User[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailUserModalOpen, setDetailUserModalOpen] = useState(false);
    const [selectedRowDetail, setSelectedRowDetail] = useState<any>();
    const [selectedRowUpdate, setSelectedRowUpdate] = useState<any>();
    const [updateUserModalOpen, setUpdateUserModalOpen] = useState<any>();
    const [docUid, setDocUid] = useState<string | undefined>();
    const [selectedRowDelete, setSelectedRowDelete] = useState<any>();
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
    const [dataUserExist, setDataUserExist] = useState<any | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        
        if(storedUserData){
          const data = JSON.parse(storedUserData);
          console.log("data user from localStorage: ", data);
          setDataUserExist(data);
        }else{
           // mengarah ke halaman notFound
           setDataUserExist(null);
        }
        getUserType().then((result) => {
            if(result && result.value){
                setUserType(result.value);
            }else{
                console.error("Nilai user type tidak dapat ditemukan");
            }
        });
    }, []);

    useEffect(() => {
        fetchData(selectedSegment);
    }, [selectedSegment]);
/*
    useEffect(() => {
        fetchData(selectedSegment);
    }, [datausers]);*/
    
    const handleSegmentChange = (e: CustomEvent) => {
        const selectedValue = e.detail.value as string | undefined;

        if(selectedValue){
            setSelectedSegment(selectedValue);
        }
    };

    const columnsDosen = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'NIP'
            },
            {
                accessorFn: (row: User) => `${row.firstName} ${row.lastName}`,
                header: 'Nama Lengkap',
            }
        ],
        []
    );
    const columnsMahasiswa = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'NIM'
            },
            {
                accessorFn: (row: User) => `${row.firstName} ${row.lastName}`,
                header: 'Nama Lengkap'
            }
        ],
        []
    );
    const columnsAdmin = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Admin ID'
            },
            {
                accessorFn: (row: User) => `${row.firstName} ${row.lastName}`,
                header: 'Nama Lengkap'
            }
        ],
        []
    );


    const table = useMaterialReactTable({
        columns: selectedSegment==='Dosen'? columnsDosen: selectedSegment === 'Mahasiswa' ? columnsMahasiswa : columnsAdmin,
        data: datausers,
        getRowId: (row) => row.id,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({row, closeMenu}) => {
            const rowActions = [
                <MenuItem key="detail" onClick={() => {
                    handleDetail(row);
                    closeMenu();
                }}>
                    Detail
                </MenuItem>,
            ];
            if(userType==='admin'){
                rowActions.push(
                    <MenuItem key="edit" onClick={() => {
                        handleUpdate(row);
                        closeMenu();
                    }}>
                        Edit
                    </MenuItem>,
                    <MenuItem style={{color : 'red'}} key="delete" onClick={() => {
                        handleDelete(row);
                        closeMenu();
                    }}>
                        Delete
                    </MenuItem>,
                );
            }
            return rowActions;
        },
    },
    );

    const handleDetail = (row: any) => {
        setSelectedRowDetail(row.original);
        setDetailUserModalOpen(true);
    };
    const handleUpdate = (row: any) => {
        setSelectedRowUpdate(row.original);
        setUpdateUserModalOpen(true);
    };
    const handleDelete = (row: any) => {
        setSelectedRowDelete(row.original);
        setDeleteUserModalOpen(true);
    };

    

    /*render table
    const renderTable = () => {
        if(selectedSegment==='Dosen'){
            return (
                <IonGrid class='table-user'>
                    <IonRow class='user-row'>
                        <IonCol size='3' class='header-table ion-text-center'>NIP</IonCol>
                        <IonCol class='header-table'>Nama Lengkap</IonCol>
                        <IonCol size='2' class='header-table'>Action</IonCol>
                    </IonRow>
                    {dataDosen.map((item, index) => (
                        <IonRow class='user-row'>
                            <IonCol size='3' class='body-table'>{item.id}</IonCol>
                            <IonCol class='body-table'>{item.firstName + " " + item.lastName}</IonCol>
                            <IonCol size='2' class='body-table'>        
                                <IonButton size='small' >
                                    <IonIcon size='small' slot='icon-only' icon={informationOutline}></IonIcon>
                                </IonButton>
                                <IonButton size='small' color={'danger'}>
                                    <IonIcon size='small' slot='icon-only' icon={trashOutline}></IonIcon>
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    ))}
                </IonGrid>
            );
        } else if(selectedSegment==='Mahasiswa') {
            return(
                <IonGrid class='table-user'>
                        <IonRow class='user-row'>
                            <IonCol size='2' class='header-table ion-text-center'>NIM</IonCol>
                            <IonCol class='header-table'>Nama Lengkap</IonCol>
                            <IonCol size='2' class='header-table'>Action</IonCol>
                        </IonRow>
                        {dataMahasiswa.map((item, index) => (
                            <IonRow class='user-row'>
                                <IonCol size='2' class='body-table'>{item.id}</IonCol>
                                <IonCol class='body-table'>{item.firstName + " " + item.lastName}</IonCol>
                                <IonCol size='2' class='body-table'>        
                                    <IonButton size='small' >
                                        <IonIcon size='small' slot='icon-only' icon={informationOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton size='small' color={'danger'}>
                                        <IonIcon size='small' slot='icon-only' icon={trashOutline}></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
            );
        } else if(selectedSegment==='Admin'){
            return(
                <IonGrid class='table-user'>
                        <IonRow class='user-row'>
                            <IonCol size='3' class='header-table ion-text-center'>Admin ID</IonCol>
                            <IonCol class='header-table'>Nama Lengkap</IonCol>
                            
                            <IonCol size='2' class='header-table'>Action</IonCol>
                        </IonRow>
                        {dataAdmin.map((item, index) => (
                            <IonRow class='user-row'>
                                <IonCol size='3' class='body-table'>{item.id}</IonCol>
                                <IonCol class='body-table'>{item.firstName + " " + item.lastName}</IonCol>
                                <IonCol size='2' class='body-table'>        
                                    <IonButton size='small'>
                                        <IonIcon size='small' slot='icon-only' icon={informationOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton size='small' color={'danger'}>
                                        <IonIcon size='small' slot='icon-only' icon={trashOutline}></IonIcon>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
            );
        }
    }*/

    const fetchData = async (roleType: string) => {
        try {
            const users = await getUsersByRole(roleType);
            setDatausers(users);
        } catch (error) {
            console.log("Error fetch data", error);
        }
    };

    return (
        <>
        {!dataUserExist ? (
            <NotFound />
        ):(
        <IonPage>
            <IonHeader>
            <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle className='ion-text-center'>User List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
                <IonList inset={true} className='ion-padding'>
                <div className='ion-text-center' style={{marginBottom: '28px'}}>
                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>User List</h1>
                </div>
                    {userType==='admin' && (
                        <IonButton style={{textTransform: 'none'}} onClick={() => setCreateModalOpen(true)}>Tambah User</IonButton>
                    )}{createModalOpen && (
                        <CreateModal data={createModalOpen} onClose={() => setCreateModalOpen(false)}/>
                    )}{detailUserModalOpen && (
                        <DetailUserModal data={selectedRowDetail} onClose={() => setDetailUserModalOpen(false)}/>
                    )
                    }{updateUserModalOpen && (
                        <UpdateUserModal data={selectedRowUpdate} onClose={() => setUpdateUserModalOpen(false)}/>
                    )}{deleteUserModalOpen && (
                        <AlertDeleteUser data={selectedRowDelete} onClose={() => setDeleteUserModalOpen(false)}/>
                    )}
                    <IonSegment value={selectedSegment} onIonChange={handleSegmentChange} className='ion-margin-bottom'>
                        <IonSegmentButton value="Dosen">
                            <IonLabel>Konselor</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Mahasiswa">
                            <IonLabel>Mahasiswa</IonLabel>
                        </IonSegmentButton>
                        {userType==='admin' && (
                            <IonSegmentButton value="Admin">
                                <IonLabel>Admin</IonLabel>
                            </IonSegmentButton>
                        )}
                    </IonSegment>
                    <MaterialReactTable table={table}></MaterialReactTable>
                    <div style={{marginBottom: '24px'}}></div>
                    {/* 
                    {renderTable()}
                    */}
                </IonList>
            </IonContent>
        </IonPage>
        )}
        </>
    );
};


export default UserList;
