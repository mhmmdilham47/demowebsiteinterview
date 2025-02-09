import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar, useIonLoading, useIonToast } from '@ionic/react';
import { add, addOutline } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { getUserType } from '../Login/LoginForm';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import NotFound from '../../pages/NotFoundPage';
import { createNews, getAllNews } from '../../firebase/NewsHandling';
import { News } from '../../context/UserDataContext';
import { serverTimestamp } from 'firebase/firestore';

const NewsAdmin: React.FC = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const imageUrlRef = useRef<HTMLIonInputElement>(null);
    const newsTitleRef = useRef<HTMLIonInputElement>(null);
    const publisherRef = useRef<HTMLIonInputElement>(null);
    const newsSummaryRef = useRef<HTMLIonTextareaElement>(null);
    const newsContentRef = useRef<HTMLIonTextareaElement>(null);
    const [presentToast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [userType, setUserType] = useState('');
    const [dataUser, setDataUser] = useState<any | null>(null);
    const [message, setMessage] = useState(
        'Please Enter News Information'
    );
    const imgsrc_default = 'https://ionicframework.com/docs/img/demos/card-media.png';
    const [posts, setPosts] = useState<News[]>([]);
    /*
    const [posts, setPosts] = useState([
        {
            imgsrc: imgsrc_default, 
            title: 'News Title', 
            publisher: 'Publisher', 
            content: "Here's a small text description for the news content. Nothing more, nothing less."
        },
    ]);*/

    useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        
        if(storedUserData){
          const data = JSON.parse(storedUserData);
          console.log("data user from localStorage: ", data);
          setDataUser(data);
        }else{
           // mengarah ke halaman notFound
           setDataUser(null);
        }

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

    const validation = () => {
        const err: string[] = [];
        console.log(validation);
        if(!newsTitleRef.current?.value){
            err.push('Title harus terisi');
        }
        if(!publisherRef.current?.value){
            err.push('Publisher harus terisi')
        }
        if(!newsContentRef.current?.value){
            err.push('Content harus terisi')
        }
        if(!newsSummaryRef.current?.value){
            err.push('Desription harus terisi')
        }
        
        return (err.length===0);
    };

    const confirm = async () => {
        const valid = validation();
        await present("Creating News");
        console.log("valid: ", valid);

        if(valid){
            if(validation()){

            
            const imageUrlValue = imageUrlRef.current?.value || imgsrc_default;
            const postData = {
                imageUrl: imageUrlValue,
                title: newsTitleRef.current?.value,
                publisher: publisherRef.current?.value,
                content: newsContentRef.current?.value,
                description: newsSummaryRef.current?.value,
                createdAt: serverTimestamp(),
            };
            try {
                await createNews(postData);
                dismiss();
                modal.current?.dismiss('confirm');
                presentToast({
                    message: 'Updated Successfully!',
                    duration: 2000,
                    position: 'bottom',
                    color: 'success',
                }); 
                location.reload();
            } catch (error) {
                console.error('Error creating news: ', error);
                dismiss();
                presentToast({
                    message: `Error creating news: ${error}`,
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                   });
            }
        }else{
            dismiss();
            presentToast({
                message: 'Error Creating: Field data tidak lengkap',
                duration: 3000,
                position: 'bottom',
                color: 'danger'
            }); 
        }
        }else{
            dismiss();
            presentToast({
                message: 'Error Creating: Field data tidak lengkap',
                duration: 3000,
                position: 'bottom',
                color: 'danger'
            });
        }
        
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
                <IonContent className='ion-padding'>
                    <IonGrid>
                        <IonRow className='ion-justify-content-center'>
                            <IonCol size='12' sizeMd='8'>
                                <IonList className='ion-padding-horizontal ion-margin-horizontal'>
                                    <IonItem lines='none' className='ion-padding-horizontal ion-margin-vertical'>
                                        <IonTitle className='ion-text-center'>{message}</IonTitle>  
                                    </IonItem>
                                    <IonLabel className='ion-margin-top'>Image Url</IonLabel>
                                    <IonInput className='ion-padding-horizontal ion-margin-vertical' type='text' ref={imageUrlRef} fill='outline'></IonInput>
                                    <IonLabel>News Title<IonLabel color={'danger'}>*</IonLabel></IonLabel>
                                    <IonInput className='ion-padding-horizontal ion-margin-vertical' type='text' ref={newsTitleRef} fill='outline'></IonInput>
                                    <IonLabel>Publisher<IonLabel color={'danger'}>*</IonLabel></IonLabel>  
                                    <IonInput className='ion-padding-horizontal ion-margin-vertical' type='text' ref={publisherRef} fill='outline'></IonInput>
                                    <IonLabel>News Summary<IonLabel color={'danger'}>*</IonLabel></IonLabel>
                                    <IonTextarea className=' ion-margin-vertical' rows={3} ref={newsSummaryRef} fill='outline'></IonTextarea>
                                    <IonLabel>News Content<IonLabel color={'danger'}>*</IonLabel></IonLabel>  
                                    <IonTextarea className=' ion-margin-vertical' rows={8} ref={newsContentRef} fill='outline'></IonTextarea>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonModal>
        );
    };

    return (
        <>
        {!dataUser||dataUser.role!=='Admin' ? (
            <NotFound />
        ): (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle className='ion-text-center'>News Page</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton id='openNews' style={{ textTransform: 'none' }}>Add News</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" color={'light'}>
                {renderModals()}
                <IonGrid fixed>
                    <IonRow class='ion-justify-content-center'>
                        <IonCol size='12' sizeMd='8' sizeLg='8' sizeXl='8'>
                        {posts.map((item, index) => (
                            <IonCard key={index} button={true} className='ion-margin-top'>
                                <img style={{width: '100%', objectFit: 'cover', height: '350px'}} alt='News Image' src={item.imageUrl}></img>
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
        )}
        </>
    );
};

export default NewsAdmin;
