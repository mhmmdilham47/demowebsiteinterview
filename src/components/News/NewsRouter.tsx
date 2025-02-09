import { IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import NewsDetail from './NewsDetail';
import { News } from '../../context/UserDataContext';

/*
interface NewsRouterProps {
    posts: News[]; // Pastikan sesuaikan dengan struktur data berita Anda
  }*/

const NewsRouter: React.FC<RouteComponentProps> = ({match}) => {
    console.log("match news router", match.url);
    return (
        <IonRouterOutlet>
            <Route path={`/app/news-detail/:idNews`} component={NewsDetail} />
        </IonRouterOutlet>
    );
};

export default NewsRouter;