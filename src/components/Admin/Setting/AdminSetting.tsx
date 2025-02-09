import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonText, IonTitle, IonToggle, IonToolbar, useIonLoading, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import BKLogo from '../../../assets/BK-logo.jpg';
import './AdminSetting.css';
import { arrowBackOutline, chevronForwardOutline, lockClosed, logInOutline, notificationsCircle, person, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import NotFound from '../../../pages/NotFoundPage';
import { updateUserById } from '../../../firebase/UsersHandling';

const SettingAdmin: React.FC = () => {
    const [activeButton, setActiveButton] = useState('account');
    const [toggleState, setToggleState] = useState(false);
    const [userData, setUserData] = useState<any | null>(null);
    const history = useHistory();
    const [firstname, setFirstname] = useState<string | null>();
    const [lastname, setLastname] = useState<string | null>();
    const [email, setEmail] = useState<string | null>();
    const [hp, setHp] = useState<string | null>();
    const [oldPass, setOldPass] = useState<string | null>();
    const [password, setPassword] = useState<string | null>();
    const [cPass, setCPass] =useState<string | null>();
    const [presentToast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        
        if(storedUserData){
            const data = JSON.parse(storedUserData);
            console.log("data user from localStorage: ", data);
            setUserData(data);

            setFirstname(data.firstName);
            setLastname(data.lastName);
            setEmail(data.realEmail);
            setHp(data.noHP);
        }else{
            setUserData(null);
        }
    }, []);

    useEffect(() => {
        validateForm();
      }, [firstname, lastname, email, hp]);

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };
/*
    const handleBack = () => {
        history.goBack();
    };*/
    const validateForm = () => {
        const errors: string[] = [];

        if(!firstname || firstname.length<1){
            errors.push('Nama Depan harus terisi');
        }
        if(!lastname || lastname.length<1){
            errors.push('Nama Belakang harus terisi');
        }
        if(!email || email.length<1){
            errors.push('Email harus terisi');
        }
        if(!hp || hp.length<1){
            errors.push('No. Hp harus terisi');
        }
        

        return (errors.length===0);
    };

    const handleUpdateAccount = async (event: any) => {
        event.preventDefault();
        await present("Updating Account");
        const valid = validateForm();
        
        console.log("valid: ", valid);
        if(valid){
            const data = {
                departemen: userData.departemen,
                email: `${userData.id}@bkm.com`,
                firstName: firstname,
                id: userData.id,
                lastName: lastname,
                noHp: hp,
                password: userData.password,
                realEmail: email,
                role: userData.role,
            }
            try {
                await updateUserById(userData.id, data);
                dismiss();
                presentToast({
                    message: 'Updated Successfully!',
                    duration: 1000,
                    position: 'bottom',
                    color: 'success',
                   }); 
            } catch (error) {
                console.error("Error updating account: ", error);
                dismiss();
                presentToast({
                    message: `Error updating account: ${error}`,
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                   });
            }
            
            //console.log("handle update account data: ", data);
        }else{
            dismiss();
            presentToast({
                message: 'Error Update: Semua field data harus terisi',
                duration: 3000,
                position: 'bottom',
                color: 'danger'
            });
        }
    };
/*
    const handleBack = () => {
        history.goBack();
    };*/

    const validateFormPass = () => {
        const err: string[] = [];
        if(!oldPass){
            err.push('Password lama harus terisi');
        }
        if(!password){
            err.push('Password baru harus terisi');
        }
        if(!cPass){
            err.push('Password konfimasi harus terisi');
        }

        return (err.length===0);
    };

    const handleUpdatePassword = async () => {
        const valid = validateFormPass();
        console.log('valid pass: ', valid);
        if(valid){
            const match = (userData.password === oldPass);
            if(match){
                const matcConfirm = (password===cPass);
                if(matcConfirm){
                    const data = {
                        departemen: userData.departemen,
                        email: `${userData.id}@bkm.com`,
                        firstName: userData.firstName,
                        id: userData.id,
                        lastName: userData.lastName,
                        noHp: userData.noHP,
                        password: cPass,
                        realEmail: userData.realEmail,
                        role: userData.role,
                    }
                    console.log('update pass: ', data);
                    
                    try {
                        await updateUserById(userData.id, data);
                        dismiss();
                        presentToast({
                            message: 'Updated Successfully!',
                            duration: 1000,
                            position: 'bottom',
                            color: 'success',
                           }); 
                           clearFieldPass();
                    } catch (error) {
                        console.error("Error updating password: ", error);
                        dismiss();
                        presentToast({
                            message: `Error updating password: ${error}`,
                            duration: 3000,
                            position: 'bottom',
                            color: 'danger'
                           });
                    }
                    
                }else{
                    presentToast({
                        message: "Confirm password doesn't macth",
                        duration: 3000,
                        position: 'bottom',
                        color: 'danger'
                    });
                }
            }else{
                presentToast({
                    message: 'Wrong Current Password',
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                });
            }
        }else{
            presentToast({
                message: 'Semua field harus terisi',
                duration: 3000,
                position: 'bottom',
                color: 'danger'
            });
        }
        
    };

    const clearFieldPass = () => {
        setOldPass('');
        setPassword('');
        setCPass('');
    };
    
    return (
        <>
        {!userData||userData.role!=='Admin' ? (
            <NotFound />
        ):(
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/admin/profile' />
                    </IonButtons >
                    <IonTitle className='ion-text-center'>Setting</IonTitle>
                </IonToolbar>    
            </IonHeader>
            <IonContent className="ion-padding">
                <IonTitle className='ion-margin-top'>My Account</IonTitle>
                <IonGrid>
                    <IonRow>
                        <IonCol sizeMd='5' sizeXl='4' sizeLg='6' sizeSm='12' className='ion-text-center'>
                            <IonList className='ion-text-center'>
                                <img src={BKLogo} alt='Profile picture' className='profile-pic'/>
                                <IonItem lines='none' className='ion-text-center'>
                                    {userData && (
                                        <IonLabel>
                                            {userData.firstName + " " + userData.lastName}
                                        </IonLabel>
                                    )}
                                    
                                </IonItem>
                                <IonItem color={'light'} lines='full' button={true} onClick={() => handleButtonClick('account')} className={activeButton === 'account' ? 'selected' : ''}>
                                    <IonIcon size='medium' icon={person} slot='start'></IonIcon>
                                    <IonLabel>Account</IonLabel>
                                    <IonIcon size='medium' icon={chevronForwardOutline} slot='end'></IonIcon>
                                </IonItem>
                                <IonItem color={'light'} lines='full' button={true} onClick={() => handleButtonClick('password')} className={activeButton === 'password' ? 'selected' : ''}>
                                    <IonIcon size='medium' icon={lockClosed} slot='start'></IonIcon>
                                    <IonLabel>Change Password</IonLabel>
                                    <IonIcon size='medium' icon={chevronForwardOutline} slot='end'></IonIcon>
                                </IonItem>
                                {/* 
                                <IonItem color={'light'} lines='full' button={true} onClick={() => handleButtonClick('notification')} className={activeButton === 'notification' ? 'selected' : ''}>
                                    <IonIcon size='medium' icon={notificationsCircle} slot='start'></IonIcon>
                                    <IonLabel>Notifications</IonLabel>
                                    <IonIcon size='medium' icon={chevronForwardOutline} slot='end'></IonIcon>
                                </IonItem>*/}
                            </IonList>
                        </IonCol>
                        <IonCol sizeMd='7' sizeXl='8' sizeLg='6' sizeSm='12'>
                        {activeButton === 'account' && userData && (
                            <IonList>
                                <IonItem lines='none' className='ion-margin-bottom'>
                                    <IonIcon size='large' icon={person} slot='start'></IonIcon>
                                    <IonLabel>Account</IonLabel>
                                </IonItem>
                                
                                    <IonItem lines='none' className='ion-margin-bottom'>
                                        <IonCol>
                                            <IonLabel className='ion-margin-bottom'>Username</IonLabel>
                                            <IonInput aria-label='text' disabled fill='outline' value={userData.id}></IonInput>
                                        </IonCol>
                                    </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>First Name</IonLabel>
                                        <IonInput aria-label='text' fill='outline' value={firstname} onIonChange={(e) => {
                                            setFirstname(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>Last Name</IonLabel>
                                        <IonInput aria-label='text' fill='outline' value={lastname} onIonChange={(e) => {
                                            setLastname(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>E-mail Address</IonLabel>
                                        <IonInput aria-label='text' fill='outline' value={email} onIonChange={(e) => {
                                            setEmail(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>No. HP</IonLabel>
                                        <IonInput aria-label='text' fill='outline' value={hp} onIonChange={(e) => {
                                            setHp(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonButton onClick={handleUpdateAccount} type='submit' color={'secondary'} expand='block' className='ion-margin-top' >Update Account</IonButton>
                            {/* Add more items as needed */}
                            </IonList>
                        )}
                        {activeButton === 'password' && (
                            <IonList>
                            <IonItem lines='none' className='ion-margin-bottom'>
                                    <IonIcon size='large' icon={lockClosed} slot='start'></IonIcon>
                                    <IonLabel>Change Password</IonLabel>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>Current Password</IonLabel>
                                        <IonInput value={oldPass} type='password' fill='outline' aria-label='password' onIonChange={(e) => {
                                            setOldPass(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>New Password</IonLabel>
                                        <IonInput value={password} type='password' fill='outline' aria-label='password' onIonChange={(e) => {
                                            setPassword(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonItem className='ion-margin-bottom' lines='none'>
                                    <IonCol>
                                        <IonLabel className='ion-margin-bottom'>Confirm Password</IonLabel>
                                        <IonInput value={cPass} type='password' fill='outline' placeholder='Confirm Password' aria-label='password' onIonChange={(e) => {
                                            setCPass(e.detail.value);
                                        }}></IonInput>
                                    </IonCol>
                                </IonItem>
                                <IonButton onClick={handleUpdatePassword} type='submit' color={'secondary'} expand='block' className='ion-margin-top' >Update Password</IonButton>
                            {/* Add more items as needed */}
                            </IonList>
                        )}
                        {/*activeButton === 'notification' && (
                            <IonList>
                                <IonItem lines='none'>
                                    <IonIcon size='large' icon={notificationsCircle} slot='start'></IonIcon>
                                    <IonLabel>Notifications</IonLabel>
                                </IonItem>
                                <IonItem lines='none'>
                                    <IonToggle checked={toggleState} onIonChange={() => setToggleState(!toggleState)}>
                                        <IonLabel>Allow Notifications</IonLabel>
                                    </IonToggle>
                                </IonItem>
                                {toggleState && (
                                    <IonList>
                                        <IonItem lines='none' className='ion-margin-bottom'>
                                            <IonLabel>Select what email notification you want to receive</IonLabel>
                                        </IonItem>
                                        <IonItem className='ion-margin-bottom' lines='none'>
                                            <IonCol>
                                                <IonLabel style={{ fontWeight: 'bold' }} className='ion-margin-bottom'>News</IonLabel>
                                                <IonCheckbox labelPlacement='start'>There is a news posted</IonCheckbox>
                                                <IonCheckbox labelPlacement='start'>There is an announcement</IonCheckbox>
                                            </IonCol>
                                        </IonItem>
                                        <IonItem className='ion-margin-bottom' lines='none'>
                                            <IonCol>
                                                <IonLabel style={{ fontWeight: 'bold' }} className='ion-margin-bottom'>Conseling</IonLabel>
                                                <IonCheckbox labelPlacement='start'>My schedule is approved</IonCheckbox>
                                                <IonCheckbox labelPlacement='start'>Someone includes me in a conseling schedule</IonCheckbox>
                                            </IonCol>
                                        </IonItem>
                                        <IonItem className='ion-margin-bottom' lines='none'>
                                            <IonCol>
                                                <IonLabel style={{ fontWeight: 'bold' }} className='ion-margin-bottom'>Messages</IonLabel>
                                                <IonCheckbox labelPlacement='start'>Someone sends me a private message</IonCheckbox>
                                            </IonCol>
                                        </IonItem>
                                        <IonButton type='submit' color={'secondary'} expand='block' className='ion-margin-top' >Update Notifications</IonButton>
                                    </IonList>
                                )}
                                
                            {/* Add more items as needed }
                            </IonList>
                        )*/}
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
        )}
        </>
    );
};

export default SettingAdmin;
