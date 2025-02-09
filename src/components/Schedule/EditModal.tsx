import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonPage, IonInput, useIonToast, IonSelect, IonSelectOption, IonDatetime, IonDatetimeButton, IonTextarea, IonText, useIonLoading } from "@ionic/react";
import { Konseling, User } from "../../context/UserDataContext";
import { useEffect, useState } from "react";
import { Firestore } from "firebase/firestore";
import * as firestore from 'firebase/firestore';
import { ListJurusan } from "./ListJurusan";
import { getUsersByID, getUsersByRole } from "../../firebase/UsersHandling";
import { updateKonselingById } from "../../firebase/ConsultHandling";

export const EditModal = (data: any) => {
    const [presentToast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [nama, setNama] = useState<string>(data.data.namaKonsulen ||'');
    const [nim, setNim] = useState<string>(data.data.idKonsulen || '');
    const [jurusan, setJurusan] = useState<string>(data.data.jurusan || '');
    const [dosenid, setDosenId] = useState<string>(data.data.idKonsultan || '');
    const [topikBimbingan, setTopikBimbingan] = useState<string>(data.data.topik || '');
    const [tanggal, setTanggal] = useState<string>(data.data.jadwal || '');
    const [userRole, setUserRole] = useState('');
    const [dosenOptions, setDosenOptions] = useState<User[]>([]);
    const [deskripsi, setDeskripsi] = useState<string>(data.data.deskripsiSingkat || '');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [detailModalOpen , setDetailModalOpen] = useState(true);
    const [detailData, setDetailData] = useState(data.data);
    const [statusKonsultasi, setStatusKonsultasi] = useState<string>(data.data.status || '');
    
    
    
    
    const formatTimestamp = (timestamp: firestore.Timestamp) => {
      const dateObject = timestamp.toDate();
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short', 
      }).format(dateObject);
    };
    const [selectedDateTime, setSelectedDateTime] = useState<string>(formatTimestamp(data.data.jadwal) || '');

  useEffect(() => {
    console.log("Detail Modal!! Data.data: ", data.data);
    console.log("selected date time converted? ", selectedDateTime)
    const storedUserData = localStorage.getItem('loggedInUser');
    if(storedUserData){
      const data = JSON.parse(storedUserData);
      console.log("data user from localStorage: ", data);

      setUserRole(data.role);
    }
    
    getUsersByRole('Dosen')
      .then((data) => {
        setDosenOptions(data);
      })
      .catch((error) => {
        console.log('Error set dosen option, ', error);
      });

      return () => {
        setDetailModalOpen(false);
      };
  }, []);

  useEffect(() => {
    console.log("Selected DateTime in State:", selectedDateTime);
  }, [selectedDateTime]);

  const handleDateTimeChange = (e: CustomEvent<any>) => {
    const newDateTime = e.detail.value;
    setSelectedDateTime(newDateTime);
    console.log("selected date time handle change: ", newDateTime);
  }

    const convertDateTimeToISOFormat = (dateTimeString: string) => {
      const months = {
        Januari: '01',
        Februari: '02',
        Maret: '03',
        April: '04',
        Mei: '05',
        Juni: '06',
        Juli: '07',
        Agustus: '08',
        September: '09',
        Oktober: '10',
        November: '11',
        Desember: '12',
      };
    
      const [tanggal, bulan, tahun, jam, menit, detik] = dateTimeString
        .replace('pukul', '')
        .replace('WITA', '')
        .trim()
        .split(' ');
        
      const [splitJam, splitMenit, splitDetik] = menit.split('.').map(component => component.padStart(2, '0'));
      console.log(`jamsplit: ${splitJam}\nmenitsplit: ${splitMenit}\ndetiksplit: ${splitDetik}`);
      console.log(`tanggal: ${tanggal}\nbulan: ${bulan}\ntahun: ${tahun}\njam: ${jam}\nmenit: ${menit}\ndetik: ${detik}`)
      const monthInNumeric = months[bulan as keyof typeof months];

      const formattedTanggal = tanggal ? tanggal.padStart(2, '0') : '01';
      // Tentukan format jam yang sesuai
      return `${tahun}-${monthInNumeric}-${formattedTanggal}T${splitJam}:${splitMenit}:${splitDetik}Z`;
      
    };

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
  const submit = async (event: any) => {
    event.preventDefault();
    await present('Processing update...');
    const valid = validateForm();
    console.log(validateForm());

    if(validateForm()){
      console.log('Form submitted');
      try {
        const konsulenData = await getUsersByID(nim);
        const konsultanData = await getUsersByID(dosenid);

        setTimeout(async () => {
          dismiss();
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

          const dateTime = selectedDateTime;
          console.log(`Datetime: ${selectedDateTime}`);
          const isoFormattedDateTime = convertDateTimeToISOFormat(dateTime);
          console.log(isoFormattedDateTime);
          const dateObject = new Date(isoFormattedDateTime);
          console.log("dateobject: ", dateObject);

          const waktuJadwal = firestore.Timestamp.fromDate(dateObject);
          //console.log('Selected date at submit: ', selectedDateTime);
          console.log('waktujadwal: ', waktuJadwal)
          
          const konselingUpdateData: Konseling = {
            idKonseling: detailData.idKonseling,
            idKonsulen: nim,
            idKonsultan: dosenid,
            jurusan: jurusan,
            namaKonsulen: `${konsulenData.firstName} ${konsulenData.lastName}`,
            namaKonsultan: `${konsultanData.firstName} ${konsultanData.lastName}`,
            topik: topikBimbingan,
            jadwal: waktuJadwal,
            deskripsiSingkat: deskripsi,
            status: statusKonsultasi,
          };

          console.log('jadwal update: ', konselingUpdateData.jadwal);
          console.log('Data Konseling yang akan diupdate:', konselingUpdateData);
          //await createNewKonseling(konselingData);
          await updateKonselingById(detailData.idKonseling, konselingUpdateData);
          presentToast({
            message: 'Form Submitted',
            duration: 1000,
            position: 'bottom',
            color: 'success',
           });
           
        }, 3000);
        handleCloseModal();
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    }else if(!validateForm()){
      presentToast({
        message: 'Error Submit: Semua field konsultasi harus terisi',
        duration: 4000,
        position: 'bottom',
        color: 'danger'
       });
    }
  };

  

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setDetailData(null); // Clear data if needed
    data.onClose(); // Call the onClose function passed from the parent
  };

    return (
        <IonModal isOpen={detailModalOpen}>
              {detailData && (
                <div style={{width: '100%', height: '100%', paddingBottom: '48px'}}>
                  <IonHeader>
                    <IonToolbar color={'secondary'}>
                      <IonTitle>Update Konsultasi</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={handleCloseModal}>Close</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className='ion-padding ion-margin-bottom'>
                  <div className='ion-text-center' style={{marginBottom: '28px'}}>
                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Detail Konsultasi</h1>
                  </div>
                    <IonList>
                      <IonGrid>
                        <IonRow >
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Nama Lengkap</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem lines="none">
                            <IonInput type="text" value={nama} onIonChange={(e) => setNama(e.detail.value!)} placeholder={detailData.namaKonsulen}></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>NIM/User ID</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonInput type="text" value={nim} onIonChange={(e) => setNim(e.detail.value!)} placeholder={detailData.idKonsulen}></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Jurusan</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonSelect value={jurusan} onIonChange={(e) => setJurusan(e.detail.value)} placeholder={detailData.jurusan}>
                                {ListJurusan.map((item, index) => (
                                    <IonSelectOption key={index} value={item.jurusan} >{item.jurusan}</IonSelectOption>
                                ))}
                                </IonSelect>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Konsultan</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonSelect value={dosenid} onIonChange={(e) => setDosenId(e.detail.value)} placeholder={detailData.idKonsultan}>
                                {dosenOptions.map((user) => (
                                    <IonSelectOption key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`}</IonSelectOption>
                                ))}
                            </IonSelect>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Topik Bimbingan</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonSelect value={topikBimbingan} onIonChange={(e) => setTopikBimbingan(e.detail.value)} placeholder={detailData.topik}>
                                <IonSelectOption value="Akademik">Akademik</IonSelectOption>
                                <IonSelectOption value="Beasiswa">Beasiswa</IonSelectOption>
                                <IonSelectOption value="Minat & Bakat">Minat & Bakat</IonSelectOption>
                                <IonSelectOption value="Karir">Karir</IonSelectOption>
                            </IonSelect>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Jadwal Konsultasi</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                          <IonDatetimeButton datetime='datetime'></IonDatetimeButton>
                            <IonModal keepContentsMounted={true}>
                              <IonDatetime 
                              showDefaultButtons={true}
                              id='datetime'
                              value={selectedDateTime}
                              onIonChange={(e: CustomEvent<any>) => {
                                const selectedValue = e.detail.value;
                                setSelectedDateTime(selectedValue); //masih tidak jalan bagus
                              }}
                              ></IonDatetime>
                            </IonModal>
                            
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Deskripsi Singkat Masalah</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonTextarea value={deskripsi} onIonChange={(e) => setDeskripsi(e.detail.value || '')} placeholder={detailData.deskripsiSingkat} rows={5} fill='outline' className='ion-margin-top'></IonTextarea>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Status Konsultasi</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            {userRole!=='Mahasiswa'&&(
                                <IonSelect value={statusKonsultasi} onIonChange={(e) => setStatusKonsultasi(e.detail.value)} placeholder={detailData.status}>
                                    <IonSelectOption value="Requested">On Request</IonSelectOption>
                                    <IonSelectOption value="Accepted">Confirmed</IonSelectOption>
                                    <IonSelectOption value="Completed">Completed</IonSelectOption>
                                    <IonSelectOption value="Rejected" color={'danger'}>Rejected</IonSelectOption>
                                </IonSelect>
                            )}
                            {userRole==='Mahasiswa'&&(
                                <IonLabel>{detailData.status}</IonLabel>
                            )}
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow class='ion-margin-top'>
                          <IonItem lines="none" className="ion-margin-top">
                            <IonButton size="default" onClick={submit}>Submit</IonButton>
                            <IonButton size="default" onClick={handleCloseModal}>Cancel</IonButton>
                          </IonItem>
                          {errorMessages.map((error, index) => (
                            <IonText key={index} color="danger">
                              {error}
                            </IonText>
                          ))}
                        </IonRow>
                      </IonGrid>
                    </IonList>
                  </IonContent>
                </div>
              )}
            </IonModal>
    );
};