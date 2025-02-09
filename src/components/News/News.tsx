import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRouterLink, IonRouterOutlet, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { add, addOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { getUserType } from '../Login/LoginForm';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { getAllNews, getLatestNews } from '../../firebase/NewsHandling';
import { News } from '../../context/UserDataContext';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import NewsRouter from './NewsRouter';
import NewsDetail from './NewsDetail';

const NewsComponent: React.FC = () => {
    const history = useHistory();
    const modal = useRef<HTMLIonModalElement>(null);
    const imageUrlRef = useRef<HTMLIonInputElement>(null);
    const newsTitleRef = useRef<HTMLIonInputElement>(null);
    const publisherRef = useRef<HTMLIonInputElement>(null);
    const newsSummaryRef = useRef<HTMLIonTextareaElement>(null);
    const [userType, setUserType] = useState('');
    const [message, setMessage] = useState(
        'Please Enter News Information'
    );
    const imgsrc_default = 'https://ionicframework.com/docs/img/demos/card-media.png';
    const [posts, setPosts] = useState<News[]>([]);
    /*const [posts, setPosts] = useState([
        {
            imgsrc: imgsrc_default, 
            title: 'News Title', 
            publisher: 'Publisher', 
            content: "Here's a small text description for the news content. Nothing more, nothing less."
        },
    ]);*/

    useEffect(() => {
        getUserType().then((result) => {
            if(result && result.value){
                setUserType(result.value);
            }else{
                console.error("Nilai user type tidak dapat ditemukan");
            }
        });

        const fetchAllNews = async () => {
            try {
                const news = await getAllNews();
                addNews(news);
            } catch (error) {
                console.error('Error fetch all news: ', error);
                throw error;
            }
        };
        fetchAllNews();
    }, []);

    const confirm = () => {
        /*
        const imageUrlValue = imageUrlRef.current?.value || imgsrc_default;
        /*const postData = {
            imgsrc: imageUrlValue,
            title: newsTitleRef.current?.value,
            publisher: publisherRef.current?.value,
            content: newsSummaryRef.current?.value,
        };

        addNews(postData);
        modal.current?.dismiss('confirm');*/
    };

    const onWillDismiss = (ev: CustomEvent<OverlayEventDetail>) => {
        console.log("Canceled");
        /*
        if(ev.detail.role==='confirm'){
            setMessage(`Hello, ${ev.detail.data}!`);
        }*/
    };

    const addNews = (postData: any) => {
        console.log("News Data: ", postData);
        const updatedPost = postData;
        setPosts(updatedPost);
    };

    const renderModals = () => {
        return (
            <IonModal ref={modal} trigger='openNews' onWillDismiss={(ev) => onWillDismiss(ev)}>
                <IonHeader>
                    <IonToolbar color={'tertiary'}>
                        <IonButtons slot='start'>
                            <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle className='ion-text-center'>Add News</IonTitle>
                        <IonButtons slot='end'>
                            <IonButton strong={true} onClick={() => confirm()}>Confirm</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent color={'light'} className='ion-padding'>
                    <IonGrid>
                        <IonRow className='ion-justify-content-center'>
                            <IonCol size='12' sizeMd='8'>
                                <IonList >
                                    <IonItem lines='none' className='ion-padding-horizontal ion-margin-vertical'>
                                        <IonTitle className='ion-text-center'>{message}</IonTitle>  
                                    </IonItem>
                                    <IonItem lines='none' className='ion-padding-horizontal'>
                                        <IonLabel>Image Url</IonLabel>  
                                    </IonItem>
                                    <IonItem lines='none' className='ion-margin-bottom ion-padding-horizontal'>
                                        <IonInput className='ion-padding-horizontal' type='text' ref={imageUrlRef} fill='outline'></IonInput>
                                    </IonItem>
                                    <IonItem lines='none' className='ion-padding-horizontal'>
                                        <IonLabel>News Title</IonLabel>  
                                    </IonItem>
                                    <IonItem lines='none' className='ion-margin-bottom ion-padding-horizontal'>
                                        <IonInput type='text' ref={newsTitleRef} fill='outline'></IonInput>
                                    </IonItem>
                                    <IonItem lines='none' className='ion-padding-horizontal'>
                                        <IonLabel>Publisher</IonLabel>  
                                    </IonItem>
                                    <IonItem lines='none' className='ion-margin-bottom ion-padding-horizontal'>
                                        <IonInput className='ion-padding-horizontal' type='text' ref={publisherRef} fill='outline'></IonInput>
                                    </IonItem>
                                    <IonItem lines='none' className='ion-padding-horizontal'>
                                        <IonLabel>News Summary</IonLabel>  
                                    </IonItem>
                                    <IonItem lines='none' className='ion-margin-bottom ion-padding-horizontal'>
                                        <IonTextarea rows={5} ref={newsSummaryRef} fill='outline'></IonTextarea>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonModal>
        );
    };

    const handleNewsClick = (idNews: string) => {
        history.push(`/app/news-detail/${idNews}`)
    };

    return (
        <>
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle className='ion-text-center'>News Page</IonTitle>
                    {/* 
                    <IonButtons slot='end'>
                        <IonButton id='openNews' style={{ textTransform: 'none' }}>Add News</IonButton>
                    </IonButtons>*/}
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" color={'light'}>
                {renderModals()}
                <IonGrid fixed>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='8' sizeXl='8'>
                        {posts.map((item, index) => (
                            <IonCard key={index} routerLink={`/app/news/${item.idNews}`} button={true} className='ion-margin-top'>
                                <img alt='News Image' src={item.imageUrl} style={{width: '100%', objectFit: 'cover', height: '350px'}}></img>
                                <IonCardHeader>
                                    <IonCardTitle>{item.title}</IonCardTitle>
                                    <IonCardSubtitle>{item.publisher}</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent className='ion-margin-bottom'>
                                    {item.description}
                                </IonCardContent>
                            </IonCard>                    
                        ))}
                        </IonCol>
                    </IonRow>
                </IonGrid> 
            </IonContent>
        </IonPage>
        </>
    );
};

export default NewsComponent;
