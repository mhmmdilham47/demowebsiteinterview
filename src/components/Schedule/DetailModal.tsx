import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonPage } from "@ionic/react";
import { Konseling } from "../../context/UserDataContext";
import { useEffect, useState } from "react";
import firestore from 'firebase/firestore'

export const DetailModal = (data: any) => {
  const [detailModalOpen , setDetailModalOpen] = useState(true);
  const [detailData, setDetailData] = useState(data.data)
  useEffect(() => {
    console.log("Detail Modal!! Data.data: ", data.data);
    return () => {
      setDetailModalOpen(false);
    };
  }, []);

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

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setDetailData(null); // Clear data if needed
    data.onClose(); // Call the onClose function passed from the parent
  };

    return (
        <IonModal isOpen={detailModalOpen}>
              {detailData && (
                <div style={{width: '100%', height: '100%'}}>
                  <IonHeader>
                    <IonToolbar color={'secondary'}>
                      <IonTitle>Detail Konsultasi</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={handleCloseModal}>Close</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className='ion-padding'>
                  <div className='ion-text-center' style={{marginBottom: '28px'}}>
                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Detail Konsultasi</h1>
                  </div>
                    <IonList className="ion-padding-bottom">
                      <IonGrid>
                        <IonRow >
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Topik Konsultasi</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                              <IonLabel>{detailData.topik}</IonLabel>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Konsulen (NIM)</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                              <IonLabel className="ion-text-wrap">{detailData.namaKonsulen} ({detailData.idKonsulen})</IonLabel>
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
                              <IonLabel>{detailData.namaKonsultan}</IonLabel>
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
                            <IonItem>
                              <IonLabel class="ion-text-wrap">{formatTimestamp(detailData.jadwal)}</IonLabel>
                            </IonItem>
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
                              <IonLabel>{detailData.status}</IonLabel>
                            </IonItem>
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
                            <IonItem>
                              <IonLabel class="ion-text-wrap">{detailData.deskripsiSingkat}</IonLabel>
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