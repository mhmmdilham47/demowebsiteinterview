import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonPage, IonRow, IonText, IonTitle, IonToast, IonToolbar, useIonLoading, useIonRouter, useIonToast } from '@ionic/react';
import { logInOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import Intro from '../Intro/Intro';
import { Preferences } from '@capacitor/preferences';
import './LoginForm.css'
import { useData } from '../../context/UserDataContext';
import { loginUser } from '../../firebase/UsersHandling';
import logoUnhas from '../../assets/unhas logo.jpg';

const INTRO_KEY = 'intro-seen';
export const USER_KEY = 'user-type';

const removeUserType = () => {
    Preferences.remove({ key: USER_KEY});
}
export const handleLogout = () => {
    removeUserType();
    localStorage.removeItem('loggedInUser');
}
export const getUserType = () => {
    const type = Preferences.get({ key: USER_KEY });
    return type;
}

const LoginForm: React.FC = () => {
    const [presentToast] = useIonToast();
    const router = useIonRouter();
    const { dataDosen, dataMahasiswa, dataAdmin } = useData();
    const [introSeen, setIntroSeen] = useState(true);
    const [present, dismiss] = useIonLoading();
    const [userID, setUser] = useState('');
    const [password, setPass] = useState('');
    

    useEffect(() => {
        const checkStorage = async () => {
            const seen = await Preferences.get({ key: INTRO_KEY });
            console.log('~file: LoginForm.tsx ~ checkStorage ~ seen:', seen);
            setIntroSeen(seen.value === 'true');
        }
        checkStorage();
    }, []);
/*
    const doLogin = async (event: any) => {
        event.preventDefault();
        await present('Logging in...');

        const dosenMatch = dataDosen.find((dosen) => dosen.id === userID && dosen.password === password);
        const mahasiswaMatch = dataMahasiswa.find((mahasiswa) => mahasiswa.id === userID && mahasiswa.password === password);
        const adminMatch = dataAdmin.find((admin) => admin.id === userID && admin.password === password);

        setTimeout(async () => {
            dismiss();
            let loggedInUser = null;
            if(dosenMatch){
                loggedInUser = dosenMatch;
                Preferences.set({ key: USER_KEY, value: 'dosen'});
                router.push('/app', 'root');
            }else if(mahasiswaMatch){
                loggedInUser = mahasiswaMatch;
                Preferences.set({ key: USER_KEY, value: 'mahasiswa'});
                router.push('/app', 'root');
            }else if(adminMatch){
                loggedInUser = adminMatch;
                Preferences.set({ key: USER_KEY, value: 'admin'});
                router.push('/app', 'root');
            }else{
                alert("Informasi yang dimasukkan salah");
            }

            if(loggedInUser){
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            }
            
        }, 2000);
    };
*/
    const handleLogin = async (event: any) => {
        event.preventDefault();
        await present('Logging in...');
        const res = await loginUser(userID, password);
        /*
        console.log('res handle login:');
        console.log(res);*/
        setTimeout(async () => {
            dismiss();
            let loggedInUser = null;
            if(!res){
                presentToast({
                 message: 'Error Login: Invalid Credentials',
                 duration: 4000,
                 position: 'bottom',
                 color: 'danger'
                });
             }else {
                 loggedInUser = res;
                 presentToast({
                     message: 'Login Successful',
                     duration: 2000,
                     position: 'bottom',
                     color: 'success',
                 });

                 if(loggedInUser.role==='Dosen'){
                    Preferences.set({ key: USER_KEY, value: 'dosen'});
                    router.push('/app', 'root');
                 }else if(loggedInUser.role==='Admin'){
                    Preferences.set({ key: USER_KEY, value: 'admin'});
                    router.push('/admin', 'root');
                    //router.push('/app', 'root'); //nanti diganti
                 }else if(loggedInUser.role==='Mahasiswa'){
                    Preferences.set({ key: USER_KEY, value: 'mahasiswa'});
                    router.push('/app', 'root');
                 }

                 localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
             }
        }, 2000);
       
    };

    const finishIntro = async() => {
        console.log('FIN');
        setIntroSeen(true);
        Preferences.set({ key: INTRO_KEY, value: 'true'});
    };

    const seeIntroAgain = () => {
        setIntroSeen(false);
        Preferences.remove({ key: INTRO_KEY });
    };
    
    return (
        <>
        {!introSeen ? (
            <Intro onFinish={finishIntro}/>
        ) : (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonTitle className='ion-text-center'>
                        Bimbingan dan Konseling Mahasiswa
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent scrollY={true} className='ion-padding'>
                <IonGrid fixed className='ion-margin-top'>
                    <IonRow className='ion-justify-content-center ion-margin-bottom'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                            <div className='ion-text-center ion-padding'>
                                <img src={logoUnhas} alt='BK logo' width={'35%'} height={'auto'} />
                            </div>
                        </IonCol>
                    </IonRow>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='6' sizeXl='4'>
                            <IonCard>
                                <IonCardContent>
                                    <div className='ion-text-center ion-margin-vertical ion-padding-bottom'>
                                        <IonText color={'dark'}>
                                            <h1>Welcome to BKM</h1>
                                        </IonText>
                                    </div>
                                    <form onSubmit={handleLogin} className='ion-padding-horizontal ion-margin-horizontal'>
                                        <IonInput onIonInput={(e: any) => setUser(e.target.value)} value={userID} fill='outline' labelPlacement='floating' label="User ID" type='text' placeholder='NIM/NIP' className='ion-margin-top'></IonInput>
                                        <IonInput onIonInput={(e: any) => setPass(e.target.value)} value={password} fill='outline' labelPlacement='floating' label='Password' type='password' className='ion-margin-vertical'></IonInput>
                                        <IonButton type='submit' color={'secondary'} expand='block' className='ion-margin-top' >
                                            Login
                                            <IonIcon icon={logInOutline} slot='end'></IonIcon>
                                        </IonButton>
                                        {/*
                                        <IonButton routerLink='/register' type='button' color={'tertiary'} expand='block' className='ion-margin-top' >
                                            Create Account
                                            <IonIcon icon={personCircleOutline} slot='end'></IonIcon>
                                        </IonButton>*/}
                                        <IonButton onClick={seeIntroAgain} size='small' type='button' fill='clear' color={'medium'} expand='block' style={{textTransform: 'none'}}>
                                            Watch intro again
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
        )}
        </>
    );
};

export default LoginForm;