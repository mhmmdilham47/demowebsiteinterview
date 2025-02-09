import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";

export const DetailUserModal = (data: any) => {
    const [detailUserOpen, setDetailUserOpen] = useState(true);
    const [detailUserData, setDetailUserData] = useState(data.data);

    useEffect(() => {
        console.log('data.data: ', detailUserData);
    }, []);

    const handleCloseModal = () => {
        setDetailUserOpen(false);
        setDetailUserData(null); // Clear data if needed
        data.onClose(); // Call the onClose function passed from the parent
      };

    return (
        <IonModal isOpen={detailUserOpen}>
            {detailUserData && (
                <div style={{width: '100%', height: '100%'}}>
                <IonHeader>
                  <IonToolbar color={'secondary'}>
                    <IonTitle>Detail User</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={handleCloseModal}>Close</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className='ion-padding'>
                <div className='ion-text-center' style={{marginBottom: '28px'}}>
                  <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Detail {`${detailUserData.firstName} ${detailUserData.lastName}`}</h1>
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
                          <IonItem>
                            <IonLabel>{`${detailUserData.firstName} ${detailUserData.lastName}`}</IonLabel>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonItem lines='none'>
                            {detailUserData.role==='Admin' && (
                                <IonLabel>ID Admin</IonLabel>
                            )}
                            {detailUserData.role==='Dosen' && (
                                <IonLabel>NIP</IonLabel>
                            )}
                            {detailUserData.role==='Mahasiswa' && (
                                <IonLabel>NIM</IonLabel>
                            )}
                          </IonItem>
                        </IonCol>
                        <IonCol size='1'>
                          <IonItem lines='none'>
                            <IonLabel>:</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel>{detailUserData.id}</IonLabel>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      {detailUserData.role!=='Admin' && (
                        <IonRow>
                        <IonCol size='4'>
                          <IonItem lines='none'>
                            <IonLabel>Departemen</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol size='1'>
                          <IonItem lines='none'>
                            <IonLabel>:</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel>{detailUserData.departemen}</IonLabel>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      )}
                      <IonRow>
                        <IonCol size='4'>
                          <IonItem lines='none'>
                            <IonLabel>Email</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol size='1'>
                          <IonItem lines='none'>
                            <IonLabel>:</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel>{detailUserData.realEmail}</IonLabel>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size='4'>
                          <IonItem lines='none'>
                            <IonLabel>Nomor Handphone</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol size='1'>
                          <IonItem lines='none'>
                            <IonLabel>:</IonLabel>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel>{detailUserData.noHP}</IonLabel>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonList>
                </IonContent>
              </div>
            )}
        </IonModal>
    );
};