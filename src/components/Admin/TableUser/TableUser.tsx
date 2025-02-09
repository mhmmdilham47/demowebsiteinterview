import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { User } from '../../../context/UserDataContext';
import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../../context/UserDataContext';
import { getUserType } from '../../Login/LoginForm';
import { getUsersByRole } from '../../../firebase/UsersHandling';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Tooltip, IconButton, Button, MenuItem } from '@mui/material';
import { CreateModal } from './CreateModal';
import { DetailUserModal } from './DetailModal';
import { UpdateUserModal } from './UpdateModal';
import { AlertDeleteUser } from './DeleteAlert';

const TableUser: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState('Dosen');
    const [userType, setUserType] = useState('');
    //const { dataDosen, setDataDosen, dataMahasiswa, setDataMahasiswa, dataAdmin, setDataAdmin, getAllData } = useData();
    const [datausers, setDatausers ] = useState<User[]>([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [detailUserModalOpen, setDetailUserModalOpen] = useState(false);
    const [selectedRowDetail, setSelectedRowDetail] = useState<any>();
    const [selectedRowUpdate, setSelectedRowUpdate] = useState<any>();
    const [updateUserModalOpen, setUpdateUserModalOpen] = useState<any>();
    const [docUid, setDocUid] = useState<string | undefined>();
    const [selectedRowDelete, setSelectedRowDelete] = useState<any>();
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

    useEffect(() => {
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
    const handleSegmentChange = (e: CustomEvent) => {
        const selectedValue = e.detail.value as string | undefined;

        if(selectedValue){
            setSelectedSegment(selectedValue);
        }
    };
    const fetchData = async (roleType: string) => {
        try {
            const users: any = await getUsersByRole(roleType);
            setDatausers(users);
        } catch (error) {
            console.log("Error fetch data", error);
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


    const tableUser = useMaterialReactTable({
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
    
    return (
        <IonList inset={true} className='ion-padding'>
            <div className='ion-text-center' style={{marginBottom: '28px'}}>
              <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>List Pengguna</h1>
            </div>
            {createModalOpen && (
                <CreateModal data={createModalOpen} onClose={() => setCreateModalOpen(false)}/>
            )}{detailUserModalOpen && (
                <DetailUserModal data={selectedRowDetail} onClose={() => setDetailUserModalOpen(false)}/>
            )
            }{updateUserModalOpen && (
                <UpdateUserModal data={selectedRowUpdate} onClose={() => setUpdateUserModalOpen(false)}/>
            )}{deleteUserModalOpen && (
                <AlertDeleteUser data={selectedRowDelete} onClose={() => setDeleteUserModalOpen(false)}/>
            )}
                    <IonSegment value={selectedSegment} onIonChange={handleSegmentChange}>
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
                    <IonGrid>
                        <IonRow className='ion-justify-content-center'>
                            <IonCol size='12' sizeSm='12' sizeMd='10' sizeLg='10' sizeXl='8'>
                            {userType==='admin' && (
                                <IonButton style={{textTransform: 'none', margin: '12px 0px 12px 32px' }} onClick={() => setCreateModalOpen(true)}>Tambah User</IonButton>
                            )}
                            </IonCol>
                        </IonRow>
                        <IonRow className='ion-justify-content-center'>
                            <IonCol size='12' sizeSm='12' sizeMd='10' sizeLg='10' sizeXl='8'>
                                <MaterialReactTable table={tableUser}></MaterialReactTable>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <div style={{marginBottom: '24px'}}></div>
                    <IonItem lines='full'>

                    </IonItem>
        </IonList>
    );
};

export default TableUser;