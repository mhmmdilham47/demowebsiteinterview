import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { News } from '../../context/UserDataContext';
import { RouteComponentProps } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getNewsByUid } from '../../firebase/NewsHandling';

interface NewsDetailProps extends RouteComponentProps<{
    idNews: string;
}>{}

const NewsDetail: React.FC = () => {
    const {idNews} = useParams<{idNews: string}>();
    const [dataNewsDetail, setDataNewsDetail] = useState<any>(null);
    //const selectedNews = posts.find((item) => item.idNews===idNews)
    useEffect(( ) => {
        console.log("idnews", idNews);
        //console.log("match params id: ", match.params.idNews);
        const fetchNews = async () => {
            try {
                const dataNews = await getNewsByUid(idNews);
                console.log("data news detail: ", dataNews);
                setDataNewsDetail(dataNews);

            } catch (error) {
                console.error("error fetch news detail:", error);
            }
        };
        
        fetchNews();
        //location.reload();
    }, [idNews]);

    const reload = () => {
        location.reload();
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>News Detaillllls</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                UI goes here...
            </IonContent>
        </IonPage>
    );
};

export default NewsDetail;