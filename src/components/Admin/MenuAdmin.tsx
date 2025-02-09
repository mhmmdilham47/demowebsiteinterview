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
//import './Menu.css'
import Schedule from '../../pages/Schedule';
import { handleLogout } from '../Login/LoginForm';
import DashboardAdmin from './DashboardAdmin';
import TableAdmin from './TableList';
import NewsAdmin from './AdminNews';
import DashboardPagesAdmin from '../../pages/AdminDashboard';
import AdminTablePages from '../../pages/AdminTable';
import AdminProfilePages from '../../pages/AdminProfile';
import AdminNewsPages from '../../pages/AdminNews';

const MenuAdmin: React.FC = () => {
  const [userData, setUserData] = useState<any | null>(null);

  const paths = [
    { name: 'Dashboard', url: '/admin/dashboard', icon: homeOutline },
    { name: 'Profile', url: '/admin/profile', icon: personCircleOutline},
    { name: 'Table List', url: '/admin/tableList',icon:listCircleOutline},
    { name: 'Post News', url: '/admin/news', icon: newspaperOutline}
   
  ];

  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser');

    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      console.log("data user from localStorage: ", data);
      setUserData(data);
    }
  }, []);

  return (
      <IonPage>
        <IonMenu contentId='mainAdmin'>
              <IonRow>
                <IonCol></IonCol>
                <IonCol>
                <IonAvatar>
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

        <IonRouterOutlet id='mainAdmin'>
            <Route exact path='/admin/dashboard' component={DashboardPagesAdmin}/>
            <Route path='/admin/tableList' component={AdminTablePages}/>
            <Route path='/admin/profile' component={AdminProfilePages} />
            <Route path='/admin/news' component={AdminNewsPages} />
            <Route exact path='/admin'>
              <Redirect to='/admin/dashboard'/>
            </Route>
        </IonRouterOutlet>
      </IonPage>
  );
};

export default MenuAdmin;
