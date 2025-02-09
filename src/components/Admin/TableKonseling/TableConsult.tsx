import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { User } from 'firebase/auth';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { Konseling } from '../../../context/UserDataContext';
import { getAllKonseling, getKonselingForMByUserID, getKonselingForDByUserID } from '../../../firebase/ConsultHandling';
import { getUsersByRole } from '../../../firebase/UsersHandling';
import * as firestore from 'firebase/firestore';
import { MenuItem, Modal } from '@mui/material';
import { DetailModal } from './DetailConsult';
import { EditModal } from './EditConsult';
import { AlertDelete } from './DeleteConsult';

const TableConsult: React.FC = () => {
    const [presentToast] = useIonToast();
  const [nama, setNama] = useState<string>('');
  const [nim, setNim] = useState<string>('');
  const [jurusan, setJurusan] = useState<string>('');
  const [dosenid, setDosenId] = useState<string>('');
  const [topikBimbingan, setTopikBimbingan] = useState<string>('');
  const [tanggal, setTanggal] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [usersSameRole, setUsersSameRole ] = useState<User[]>([]);
  const [name, setName] = useState<string>('');
  const [konselingData, setKonselingData] = useState<Konseling[]>([]);
  const [userRole, setUserRole] = useState('');
  const [selectedRowDetailData, setSelectedRowDetailData] = useState<any>();
  const [selectedRowEditData, setSelectedRowEditData] = useState<any>();
  const [selectedRowDeleteData, setSelectedRowDeleteData] = useState<any>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dosenOptions, setDosenOptions] = useState<User[]>([]);
  const [selectedDateTime, setSelectedDateTime] = useState<string | undefined>();
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);


    const fetchForAdmin = async () => {
        try {
          const kons = await getAllKonseling();
          setKonselingData(kons);
        } catch (error) {
          console.error('Error set konseling data: ', error);
        }
      }
    
      useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        if(storedUserData){
          const data = JSON.parse(storedUserData);
          console.log("data user from localStorage: ", data);
          fetchForAdmin();
          /*
          if(data.role==='Admin'){
            fetchForAdmin();
          }else{
            fetchKonselingById(data.id);
          }
    /*
          getUsersByRole('Dosen')
          .then((data) => {
            setDosenOptions(data);
          })
          .catch((error) => {
            console.log('Error set dosen option, ', error);
          });
    
          getUsersByRole(data.role)
          .then((users) => {
            setUsersSameRole(users);
          })
          .catch((error) => {
            console.error('Error getting users: ', error);
          });*/
        }
        
      }, []);
      const handleDateTimeChange = (e: CustomEvent<any>) => {
        setSelectedDateTime(e.detail.value);
      };
      const formatTimestamp = (timestamp: firestore.Timestamp) => {
        const dateObject = timestamp.toDate();
        return dateObject.toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        })
        /*
        return new Intl.DateTimeFormat('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short', 
        }).format(dateObject);*/
      };
      const columnsAdmin = useMemo<MRT_ColumnDef<Konseling>[]>(
        () => [
            {
              accessorKey: 'status',
              header: 'Status'
            },
            {
              accessorKey: 'namaKonsulen',
              header: 'Konsulen/Peserta'
            },
            {
              accessorKey: 'namaKonsultan',
              header: 'Konsultan'
            },
            {
              accessorKey: 'topik',
              header: 'Topik'
            },
            {
              accessorKey: 'jadwal',
              header: 'Jadwal',
              accessorFn: (row: Konseling) => formatTimestamp(row.jadwal),
            },
        ],
        []
        );
        const fetchKonselingById = async (id: string) => {
          try {
            if(userRole==='Mahasiswa'){
              const konselingM = await getKonselingForMByUserID(id);
              setKonselingData(konselingM);
            }else if(userRole==='Dosen'){
              const konselingD = await getKonselingForDByUserID(id);
              setKonselingData(konselingD);
            }
          } catch (error) {
            console.log('Error Fetch Konseling: ', error);
          }
        };
    
        const tableConsult = useMaterialReactTable({
          columns: columnsAdmin,
          data: konselingData || [],
          getRowId: (row) => row.idKonseling,
          createDisplayMode: 'modal',
          editDisplayMode: 'modal',
          enableRowActions: true,
          positionActionsColumn: 'last',
            renderRowActionMenuItems: ({row, closeMenu}) => [
                <MenuItem key="detail" onClick={() => {
                  handleDetailClick(row);
                  closeMenu();
                  }}>
                    Detail
                </MenuItem>,
                <MenuItem key="edit" onClick={() => {
                  handleEditClick(row);
                  closeMenu();
                  }}>
                    Edit
                </MenuItem>,
                <MenuItem style={{color : 'red'}} key="delete" onClick={() => {
                  handleDeleteClick(row);
                  closeMenu();
                }}>
                    Delete
                </MenuItem>,
            ],
        });
    
        const handleDetailClick = (row: any) => {
          const rowTrans = row;
          setSelectedRowDetailData(row.original);
          setIsDetailModalOpen(true);
        };
    
        const handleEditClick = (row: any) => {
          const rowData = row;
          setSelectedRowEditData(row.original);
          setIsEditModalOpen(true);
        };
    
        const handleDeleteClick = (row: any) => {
          setSelectedRowDeleteData(row.original);
          console.log(selectedRowDeleteData);
          setIsDeleteAlertOpen(true);
        };

    return (
        <IonList inset={true} className='ion-margin-bottom'>
            <div className='ion-text-center' style={{marginBottom: '28px'}}>
              <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>Jadwal Konsultasi</h1>
            </div>
            <div style={{marginRight: '12px', marginLeft: '12px'}}>
              <IonGrid>
                <IonRow className='ion-justify-content-center'>
                  <IonCol size='12' sizeSm='12' sizeMd='12' sizeLg='10' sizeXl='10'>
                    <MaterialReactTable table={tableConsult}></MaterialReactTable>
                  </IonCol>
                </IonRow>
              </IonGrid>
              
            </div>
            {isDetailModalOpen && (
              <DetailModal data={selectedRowDetailData} onClose={() => setIsDetailModalOpen(false)}/>
            )}
            {isEditModalOpen && (
              <EditModal data={selectedRowEditData} onClose={() => setIsEditModalOpen(false)} />
            )}
            {isDeleteAlertOpen && (
              <AlertDelete data={selectedRowDeleteData} onClose={() => setIsDeleteAlertOpen(false)}/>
            )}
           <IonItem lines='full' className='ion-margin-top'></IonItem>
          </IonList>
    );
};

export default TableConsult;