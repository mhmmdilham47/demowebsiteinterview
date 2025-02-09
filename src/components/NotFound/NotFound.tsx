import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import notFoundImage from '../../assets/error-404-concept-landing-page_52683-12188.webp'

const NotFoundComp: React.FC = () => {

    const handleButtonBack = () => {
        window.history.back();
    };

    return (
        <IonPage>
            <IonHeader>
                {/** 
                <IonToolbar color={'primary'}>
                    <IonTitle className='ion-text-center'>Page Error</IonTitle>
                </IonToolbar>*/}
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow className='ion-justify-content-center ion-text-center'>
                        <IonCol>
                            <div className='ion-text-center' style={{marginBottom: '28px'}}>
                                <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '54px' }}>Oops!</h1>
                            </div>
                            <div className='ion-text-center' style={{marginBottom: '28px'}}>
                                <h2 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>404: Page Not Found</h2>
                            </div>
                            <IonLabel className='ion-margin-bottom' style={{ lineHeight: '1.5', color: 'gray', fontSize:'20px'}}>
                                You cannot access this page<br/>
                            </IonLabel>
                            <IonButton onClick={handleButtonBack} size='default' shape='round' className='ion-margin-top ion-margin-bottom' style={{ textTransform: 'none' }}>
                                Back to previous
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                
            </IonContent>
        </IonPage>
    );
};

export default NotFoundComp;