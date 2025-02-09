import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './Details.css'

const Detail: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/app/home' />
                    </IonButtons >
                    <IonTitle className='ion-text-center'>My Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'></IonContent>
        </IonPage>
    );
};

export default Detail;