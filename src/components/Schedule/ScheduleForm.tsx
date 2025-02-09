import React, { useEffect, useMemo, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonDatetime,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonButtons,
  IonMenuButton,
  IonTextarea, 
  IonSearchbar,
  IonCol,
  IonGrid,
  IonRow,
  IonPage,
  IonText,
  useIonToast


} from '@ionic/react';
import './ScheduleForm.css';
import { getUserByRef, getUsersByID, getUsersByRole } from '../../firebase/UsersHandling';
import { Konseling, User } from '../../context/UserDataContext';
import { chevronForwardOutline } from 'ionicons/icons';
import consult2 from '../../assets/people-talking-concept-illustration_114360-6852.webp';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { createNewKonseling, getAllKonseling, getKonselingForDByUserID, getKonselingForMByUserID } from '../../firebase/ConsultHandling';
import { MenuItem, Modal } from '@mui/material';
import { DocumentReference } from 'firebase/firestore';
import { DetailModal } from './DetailModal';
import { ListJurusan } from './ListJurusan';
import { Firestore } from 'firebase/firestore';
import * as firestore from 'firebase/firestore';
import { EditModal } from './EditModal';
import { AlertDelete } from './AlertDelete';
import NotFound from '../../pages/NotFoundPage';

const ScheduleForm: React.FC = () => {
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
  const [userData, setUserData] = useState<any | null>(null);
  
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
      setUserData(data);

        if(data.role==='Admin'){
          fetchForAdmin();
        }else{
          fetchKonselingById(data.id, data.role);
        }

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
      });
    }else{
      setUserData(null);
    }
    
  }, []);


/*  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser');
    
    if(storedUserData){
      const data = JSON.parse(storedUserData);
      

      setUserRole(data.role);
      if(userRole==='Admin'){
        getAllKonseling()
        .then((data) => {
          setKonselingData(data);
          
        })
        .catch((error) => {
          console.log('Error set konseling data: ', error);
        });
      }else{
        fetchKonselingById(data.id);
      }
    }
  }, [konselingData]);  */

  const validateForm = () => {
    const errors: string[] = [];
  
    // Validasi Nama
    if (!nama) {
      errors.push('Nama harus diisi');
    }
  
    // Validasi NIM
    if (!nim) {
      errors.push('NIM harus diisi');
    }
  
    // Validasi Jurusan
    if (!jurusan) {
      errors.push('Jurusan harus dipilih');
    }
  
    // Validasi Pilih Konsultan
    if (!dosenid) {
      errors.push('Konsultan harus dipilih');
    }
  
    // Validasi Topik Bimbingan & Konseling
    if (!topikBimbingan) {
      errors.push('Topik harus dipilih');
    }
  
    // Validasi Jadwal Konsultasi
    if (!selectedDateTime) {
      errors.push('Jadwal konsultasi harus diisi');
    }
  
    // Validasi Ceritakan Singkat Masalahmu
    if (!deskripsi) {
      errors.push('Deskripsi harus diisi');
    }
  
    setErrorMessages(errors);
  
    return (errors.length === 0);
  };

  const handleDateTimeChange = (e: CustomEvent<any>) => {
    setSelectedDateTime(e.detail.value);
  };

  const submit = async (event: any) => {
    event.preventDefault();
    setIsValid(validateForm());
    console.log(validateForm());

    if(validateForm()){
      console.log('Form submitted');
      try {
        const konsulenData = await getUsersByID(nim);
        const konsultanData = await getUsersByID(dosenid);

        if (!konsulenData || !konsultanData) {
          // Handle jika data pengguna tidak ditemukan
          console.log('Data pengguna tidak ditemukan');
          presentToast({
            message: 'Error: Data pengguna tidak ditemukan. Harap mengisi data dengan benar.',
            duration: 3000,
            position: 'bottom',
            color: 'danger',
           });
          return;
        }

        console.log("selected time submit create: ", selectedDateTime);

        const konselingData: Konseling = {
          idKonseling: '',
          idKonsulen: nim,
          idKonsultan: dosenid,
          jurusan,
          namaKonsulen: `${konsulenData.firstName} ${konsulenData.lastName}`,
          namaKonsultan: `${konsultanData.firstName} ${konsultanData.lastName}`,
          topik: topikBimbingan,
          jadwal: firestore.Timestamp.fromDate(new Date(selectedDateTime || '')),
          deskripsiSingkat: deskripsi,
          status: 'Requested',
        };

        console.log('Data Konseling yang akan disimpan:', konselingData);
        await createNewKonseling(konselingData);
        presentToast({
          message: 'Form Submitted',
          duration: 1000,
          position: 'bottom',
          color: 'success',
         });

      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }else{
      presentToast({
        message: 'Error Submit: Semua field konsultasi harus terisi',
        duration: 4000,
        position: 'bottom',
        color: 'danger'
       });
    }
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

  const columnsKonsulen = useMemo<MRT_ColumnDef<Konseling>[]>(
    () => [
        {
          accessorKey: 'status',
          header: 'Status'
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
  const columnsKonsultan = useMemo<MRT_ColumnDef<Konseling>[]>(
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
    const fetchKonselingById = async (id: string, role: string) => {
      
      try {
        if(role==='Mahasiswa'){
          const konselingM = await getKonselingForMByUserID(id);
          setKonselingData(konselingM);
        }else if(role==='Dosen'){
          const konselingD = await getKonselingForDByUserID(id);
          setKonselingData(konselingD);
        }
      } catch (error) {
        console.log('Error Fetch Konseling: ', error);
      }
    };

    const table = useMaterialReactTable({
      columns: userRole==='Dosen' ? columnsKonsultan: userRole==='Mahasiswa' ? columnsKonsulen : columnsAdmin,
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

    const filterUsersByName = () => {
      return usersSameRole.filter((user) => {
        return user.firstName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    };
  
    const handleSearch = (event: any) => {
      setSearchTerm(event.detail.value);
    };
    const handleSelectUser = (user: any) => {
      setName(user.firstName);
      setSearchTerm(user.firstName + " " + user.lastName); // Mengisi input dengan nilai nama pengguna yang dipilih
    };
    const filteredUsers = filterUsersByName();

  return (
    <>
    {!userData ? (
      <NotFound />
    ) : (
    <IonPage>
      <IonHeader>
            <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle className='ion-text-center'>Schedule</IonTitle>
                </IonToolbar>
            </IonHeader>
      <IonContent>
        <IonList className='ion-margin-bottom'>
            <div className='ion-text-center' style={{marginBottom: '28px'}}>
              <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>Jadwal Konsultasi Saya</h1>
            </div>
            <div style={{marginRight: '12px', marginLeft: '12px'}}>
              <IonGrid>
                <IonRow className='ion-justify-content-center'>
                  <IonCol size='12' sizeSm='10' sizeMd='10' sizeLg='10'sizeXl='8'>
                    <MaterialReactTable table={table}></MaterialReactTable>
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
          <IonList className='ion-padding'>
            <div className='ion-text-center' style={{marginBottom: '28px'}}>
              <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>Buat Jadwal Konsultasi</h1>
            </div>
            <IonGrid>
              <IonRow className='ion-justify-content-center'>
                <IonCol size='9' sizeSm='12' sizeMd='8' sizeLg='6' sizeXl='6'>
                <IonItem>
                    <IonLabel position="floating" style={{ fontWeight: 'bold' }}>Nama</IonLabel>
                    <IonInput type="text" value={nama} onIonChange={(e) => setNama(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel position="floating" style={{ fontWeight: 'bold' }}>NIM</IonLabel>
                    <IonInput type="text" value={nim} onIonChange={(e) => setNim(e.detail.value!)}></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel style={{ fontWeight: 'bold' }}>Jurusan</IonLabel>
                    <IonSelect value={jurusan} onIonChange={(e) => setJurusan(e.detail.value)}>
                      {ListJurusan.map((item, index) => (
                        <IonSelectOption key={index} value={item.jurusan} >{item.jurusan}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel style={{ fontWeight: 'bold' }}>Pilih Konsultan</IonLabel>
                    <IonSelect value={dosenid} onIonChange={(e) => setDosenId(e.detail.value)}>
                      {dosenOptions.map((user) => (
                        <IonSelectOption key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel style={{ fontWeight: 'bold' }}>Topik Bimbingan & Konseling</IonLabel>
                    <IonSelect value={topikBimbingan} onIonChange={(e) => setTopikBimbingan(e.detail.value)}>
                      <IonSelectOption value="Akademik">Akademik</IonSelectOption>
                      <IonSelectOption value="Beasiswa">Beasiswa</IonSelectOption>
                      <IonSelectOption value="Minat & Bakat">Minat & Bakat</IonSelectOption>
                      <IonSelectOption value="Karir">Karir</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem className='ion-margin-bottom'>
                    <IonLabel style={{ fontWeight: 'bold' }}>Jadwal Konsultasi</IonLabel>
                    <IonDatetimeButton datetime='datetime' datatype='timestamp' ></IonDatetimeButton>
                      <IonModal keepContentsMounted={true}>
                        <IonDatetime 
                        showDefaultButtons={true}
                        id='datetime'
                        value={selectedDateTime}
                        onIonChange={handleDateTimeChange}
                        ></IonDatetime>
                      </IonModal>
                    
                  </IonItem>
                  <IonLabel className='ion-padding-horizontal' style={{ fontWeight: 'bold' }}>Ceritakan Singkat Masalahmu</IonLabel>
                  <IonTextarea className='ion-padding-horizontal ion-margin-top' value={deskripsi} onIonChange={(e) => setDeskripsi(e.detail.value || '')} placeholder='Ceritakan Singkat Masalahmu' rows={5} fill='outline'></IonTextarea>
                  <IonButton expand='full' onClick={submit}>
                      Submit
                  </IonButton>
                </IonCol>
                
              </IonRow>
            </IonGrid>
          
        </IonList>
        
        {errorMessages.map((error, index) => (
          <IonText key={index} color="danger">
            {error}
          </IonText>
        ))}
        
      </IonContent>
    </IonPage>
    )}
    </>
  );
};

export default ScheduleForm;


