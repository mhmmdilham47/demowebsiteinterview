import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCheckbox, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { checkmarkDoneOutline } from 'ionicons/icons';
import React from 'react';
import './RegisterForm.css'

const RegisterForm: React.FC = () => {
    const router = useIonRouter ();
    const doRegister = (event: any) => {
        event.preventDefault();
        console.log('doRegister');
        router.goBack();
    }; 
    return (
        <IonPage>
        <IonHeader>
            <IonToolbar color={'primary'}>
                <IonButtons slot="start">
                    <IonBackButton defaultHref='/'/>
                   </IonButtons>
                <IonTitle>
                    Create Account
                </IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent scrollY={true}>
            <IonGrid fixed>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='6'>
                            <IonCard>
                                <IonCardContent>
                                    <div className='ion-text-center ion-margin-vertical'>
                                        <IonText color={'dark'}>
                                            <h1>Create your account</h1>
                                        </IonText>
                                    </div>
                                    
                                    <form onSubmit={doRegister}>
                                        <div className='ion-padding-top ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>Nama Lengkap</h2>
                                            </IonText>
                                            <IonInput fill='outline' type='text' placeholder='Nama Lengkap'></IonInput>
                                        </div>                           
                                        <div className='ion-padding-top ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>Alamat Email</h2>
                                            </IonText>
                                            <IonInput fill='outline' type='email' placeholder='Email'></IonInput>
                                        </div>                          
                                        <div className='ion-padding-top ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>Nomor Telephone</h2>
                                            </IonText>
                                            <IonInput fill='outline' label='+62' labelPlacement='fixed' type='tel'></IonInput>
                                        </div>
                                        <div className='ion-padding-top ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>User ID</h2>
                                            </IonText>
                                            <IonInput fill='outline' type='text' placeholder='NIM/NIP'></IonInput>
                                        </div>
                                        <div className='ion-padding-top ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>Password</h2>
                                            </IonText>
                                            <IonInput fill='outline' type='password' placeholder='Password'></IonInput>
                                        </div>
                                        <div className='ion-padding-top ion-margin-bottom ion-padding-horizontal'>
                                            <IonText color={'dark'}>
                                                <h2>Confirm Password</h2>
                                            </IonText>
                                            <IonInput fill='outline' type='password' placeholder='Enter password again'></IonInput>
                                        </div>
                                        <IonCheckbox className='ion-padding-horizontal ion-margin-bottom'>I agree to the terms and conditions</IonCheckbox>;
                                        <IonButton type='submit' color={'secondary'} expand='block' className='ion-padding-vertical ion-padding-horizontal'>
                                            Create Account
                                            <IonIcon icon={checkmarkDoneOutline} slot='end'></IonIcon>
                                        </IonButton>
                                    </form>
                                </IonCardContent> 
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
             
        </IonContent>
        <IonFooter>
            
        </IonFooter>
    </IonPage>
    );
};

export default RegisterForm;