import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonAvatar, IonButton, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonMenu, IonMenuToggle, IonPage, IonRouterLink, IonRouterOutlet, IonRow, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import { homeOutline, newspaperOutline, logOutOutline, settingsOutline, personCircleOutline, contractOutline, personCircle, listCircleOutline, calendar, calendarOutline } from 'ionicons/icons';
import Bklogo from '../../assets/BK-logo.jpg';
import Home from '../../pages/Home';
import Details from '../../pages/Details';
import Profile from '../../pages/Profile';
import News from '../../pages/News';
import ListContact from '../../pages/ListUser';
import './Menu.css'
import Schedule from '../../pages/Schedule';
import { handleLogout } from '../Login/LoginForm';

const Menu: React.FC = () => {
  const [userData, setUserData] = useState<any | null>(null);

  const paths = [
    { name: 'Home', url: '/app/home', icon: homeOutline },
    { name: 'Profile', url: '/app/profile', icon: personCircleOutline},
    { name: 'User List', url: '/app/UserList',icon:listCircleOutline},
    { name: 'Schedule', url: '/app/schedule', icon: calendarOutline}, 
    { name: 'News', url: '/app/news', icon: newspaperOutline}
   
  ];

  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser');

    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      console.log("data user from localStorage: ", data);
      setUserData(data);
    }
  }, []);

  const goToProfile = () => {

  };

  return (
      <IonPage>
        <IonMenu contentId='main'>
              <IonRow>
                <IonCol></IonCol>
                <IonCol>
                <IonAvatar onClick={goToProfile}>
                  <img alt={Bklogo} src='src/assets/BK-logo.jpg'/>
                </IonAvatar>
                </IonCol>
                <IonCol></IonCol>
              </IonRow >
          <IonItem lines='full'>
            <IonRow className='barismenu1'>
              {userData && (
                <div>
                  <IonLabel color={'dark'} className='ion-text-center'>{`${userData.firstName} ${userData.lastName}`}</IonLabel>
                  <h6 className='ion-text-center'>{userData.role}</h6>
                </div>
              )}
            </IonRow>
          </IonItem>
          <IonContent>
            {paths.map((item, index) => (
              <IonMenuToggle autoHide={false} key={index}>
                <IonItem detail={true} routerLink={item.url} routerDirection='none'>
                  <IonIcon size='large' icon={item.icon} slot='start'/>
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}
            <IonMenuToggle autoHide={false}>
              <IonButton
              onClick={handleLogout}
                routerLink='/'
                routerDirection='root'
                expand='full'
                color={'secondary'}>
                <IonIcon icon={logOutOutline} slot='start'></IonIcon>
                Logout
              </IonButton>
            </IonMenuToggle>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id='main'>
            <Route exact path='/app/home' component={Home} />
            <Route path='/app/profile' component={Profile} />
            <Route path='/app/schedule' component={Schedule} />
            <Route path='/app/news' component={News} />
            <Route path='/app/home/details' component={Details} />
            <Route path='/app/UserList' component={ListContact}/>
            <Route exact path='/app'>
              <Redirect to='/app/home' />
            </Route>
        </IonRouterOutlet>
      </IonPage>
  );
};

export default Menu;
