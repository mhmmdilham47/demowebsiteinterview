import { IonAvatar, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonNote, IonPage, IonRow, IonTextarea, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './ProfileAdmin.css'
import BKlogo from '../../../assets/BK-logo.jpg';
import { homeOutline, settingsOutline, personCircleSharp, chevronForwardOutline, mailOutline, notificationsCircleOutline, phonePortraitOutline, schoolOutline, personCircleOutline, keyOutline, logOutOutline, chatbubbleOutline} from 'ionicons/icons';
import { useData } from '../../../context/UserDataContext';
import { handleLogout } from '../../Login/LoginForm';
import BannerProfile from '../../../assets/foto-banner.jpg'
import NotFound from '../../../pages/NotFoundPage';


const ProfileAdmin: React.FC = ()=> {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser');
    
    if(storedUserData){
      const data = JSON.parse(storedUserData);
      console.log("data user from localStorage: ", data);
      setUserData(data);
    }else{
      setUserData(null);
    }
  }, []);

  const goToSetting = () => {
    window.location.href='/admin/profile/setting'
  };
  
 return (
  <>
  {!userData||userData.role!=='Admin' ? (
    <NotFound />
  ):(
    <IonPage>
      <IonHeader translucent no-border className='head'>
        <IonToolbar className='tool'color={'primary'}>
            <IonButtons slot='start'>
              <IonMenuButton />
            </IonButtons>
          <IonTitle color="aqua" className='title'>Profile</IonTitle>
          <IonButtons slot='end' className='ion-margin-end' >
            <IonButton >
              <IonIcon size='large' slot='icon-only' icon={chatbubbleOutline}>
              </IonIcon>
            </IonButton >
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent color={'light'} className='ion-padding ion-padding-horizontal'>
        <IonGrid class='ion-margin-top' style={{marginTop: '32px'}}>
          <IonRow className='coba2'>
           <IonCol size='12' sizeMd='12' sizeLg='10' sizeXl='8' class='ion-align-items-center ion-justify-content-center' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
             <IonList inset={true} className='ion-margin'>
               <IonCol className='bannerprofile'>
                 <img src={BannerProfile} alt='BannerProfile' />
               </IonCol>
               <IonRow>
                 <IonCol className='coba1'>
                   <div className="header">
                     <img src={BKlogo} alt='' />
                     {userData && (
                       <div className='hm'>
                         {userData.firstName + " " + userData.lastName}
                       </div>
                     )}
                     {userData && (
                       <h1 className='univ'>{userData.role}</h1>
                     )}
                   </div>

                 </IonCol>
                 <IonButtons className='ion-margin-end' onClick={goToSetting}>
                   <IonButton className='button2'>
                     <IonIcon slot='icon-only' icon={settingsOutline}>
                     </IonIcon>
                   </IonButton >
                 </IonButtons>
               </IonRow>

               <IonList inset={true} className='datadiri'>
                 <div>
                   <IonItem>
                     <IonIcon size='large' icon={personCircleOutline} slot='start'></IonIcon>
                     {userData && (
                       <IonLabel>Student ID :  {userData.id}</IonLabel>
                     )}
                   </IonItem>
                   <IonItem>
                     <IonIcon size='large' icon={mailOutline} slot='start'></IonIcon>
                     {userData && (
                       <IonLabel> Email : {userData.realEmail}</IonLabel>
                     )}

                   </IonItem>
                   <IonItem>
                     <IonIcon size='large' icon={phonePortraitOutline} slot='start'></IonIcon>
                     {userData && (
                       <IonLabel> Telephone : {userData.noHP}</IonLabel>
                     )}

                   </IonItem>
                   {userData && (userData.role === 'Mahasiswa' || userData.role === 'Dosen') && (
                     <IonItem>
                       <IonIcon size='large' icon={schoolOutline} slot='start'></IonIcon>
                       <IonLabel > Department : {userData.departemen} </IonLabel>
                     </IonItem>
                   )}
                 </div>
               </IonList>
               <IonList inset={true} className='datadiri ion-margin'>

                 <IonItem button href='/app/profile/setting'>
                   <IonIcon size='large' icon={mailOutline} slot='start'></IonIcon>
                   <IonLabel> Change Email</IonLabel>
                   <IonIcon slot='end' icon={chevronForwardOutline}></IonIcon>
                 </IonItem>
                 <IonItem button href='/app/profile/setting'>
                   <IonIcon size='large' icon={keyOutline} slot='start'></IonIcon>
                   <IonLabel> Change Password</IonLabel>
                   <IonIcon slot='end' icon={chevronForwardOutline}></IonIcon>
                 </IonItem>
                 {/* 
              <IonItem button href='/app/profile/setting'>
              <IonIcon size='large' icon={notificationsCircleOutline} slot='start'></IonIcon>
              <IonLabel> Notification Setting</IonLabel>
              <IonIcon slot='end' icon={chevronForwardOutline}></IonIcon>
            </IonItem>
            <IonItem>
              <IonToggle>
                <IonLabel>Allow Notifications</IonLabel>
                <IonNote color="medium">Unsubscribe at any time</IonNote>
              </IonToggle>
            </IonItem>*/}
                 <IonItem button routerLink='/' routerDirection='root' onClick={handleLogout}>
                   <IonIcon color={'danger'} size='large' icon={logOutOutline} slot='start'></IonIcon>
                   <IonLabel color={'danger'} > Logout </IonLabel>
                   <IonIcon color={'danger'} slot='end' icon={chevronForwardOutline}></IonIcon>
                 </IonItem>
               </IonList>
             </IonList>
            </IonCol>
          </IonRow>
         <IonRow className='coba2'>
            <IonNote color="medium" class="ion-margin-horizontal">
              Safe Your Mentality And Growth With Our App
            </IonNote>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
    )}
    </>
 )
};

export default ProfileAdmin;
