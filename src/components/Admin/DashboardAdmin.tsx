import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonNote, IonPage, IonRouterLink, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, IonicSlides } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
//import './HomeDashboard.css';
import { Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import { briefcaseOutline, calendarOutline, chatbubblesOutline, eyeOutline, footballOutline, libraryOutline, listCircleOutline, newspaperOutline, peopleOutline, personOutline, schoolOutline } from 'ionicons/icons';
import  BannerDashboard from "../../assets/istockphoto-1461586589-612x612.jpg";
import consult from '../../assets/Intro/job-interview-conversation_74855-7566.webp';
import consult2 from '../../assets/people-talking-concept-illustration_114360-6852.webp';
import news1 from '../../assets/photo-1477281765962-ef34e8bb0967.webp';
import news2 from '../../assets/photo-1698421823571-bf9617fab3ff.webp';
import news3 from '../../assets/photo-1669115380104-886eeab91820.webp';
import logoUnhas from '../../assets/unhas logo.jpg';
import NotFound from '../../pages/NotFoundPage';
import { countUsers, countUsersByRole } from '../../firebase/UsersHandling';
import { countNews } from '../../firebase/NewsHandling';
import { countKonseling } from '../../firebase/ConsultHandling';

const DashboardAdmin: React.FC = () => {
    const [userData, setUserData] = useState<any | null>(null);
    const [countAllUser, setCountAllUser] = useState<number>();
    const [countMahasiswa, setCountMahasiswa] = useState<number>();
    const [countDosen, setCountDosen] = useState<number>();
    const [countAdmin, setCountAdmin] = useState<number>();
    const [countAllNews, setCountAllNews] = useState<number>();
    const [countAllSchedule, setCountAllSchedule] = useState<number>();

    const layanan = [
        {icon: personOutline, title: "Konseling Individu"},
        {icon: peopleOutline, title: "Konseling Kelompok"},
        {icon: libraryOutline, title: "Konseling Akademik"},
        {icon: schoolOutline, title: "Konseling Beasiswa"},
        {icon: footballOutline, title: "Konseling Minat & Bakat"},
        {icon: briefcaseOutline, title: "Konseling Karir"},
        {icon: chatbubblesOutline, title: "Mediasi Kasus"},
    ];
    const group1 = layanan.slice(0, 3);
    const group2 = layanan.slice(3, 6);
    const group3 = layanan.slice(6);

    const dataNewsCarousel = [
        {image: news1, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: news2, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: news3, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: logoUnhas, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: news1, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: news2, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
        {image: news3, title: 'News Title', publisher: 'News Publisher', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore culpa deleniti odio?'},
    ];

    useEffect(() => {
        const storedUserData = localStorage.getItem('loggedInUser');
        
        if(storedUserData){
          const data = JSON.parse(storedUserData);
          console.log("data user from localStorage: ", data);
          setUserData(data);
          setTimeout(() => {
            getStat();
          }, 3000);
        }else{
            setUserData(null);
        }
      }, []);

      const getStat = async () => {
        try {
            const user = await countUsers();
            const news = await countNews();
            const schedule = await countKonseling();
            setCountAllNews(news);
            setCountAllSchedule(schedule);
            setCountAllUser(user);

            const mahasiswa = await countUsersByRole("Mahasiswa");
            const dosen = await countUsersByRole("Dosen");
            const admin = await countUsersByRole("Admin");
            setCountAdmin(admin);
            setCountDosen(dosen);
            setCountMahasiswa(mahasiswa);

        } catch (error) {
            console.error("get stat: ", error);
            throw error;
        }
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
                        <IonMenuButton autoHide={false}/>
                    </IonButtons>
                    <IonTitle className='ion-text-center'>Dashboard Admin</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList className='ion-margin-bottom'>
                    <IonItem lines='full' className='ion-margin-vertical ion-padding banner-text' >
                        <IonGrid style={{paddingBottom: '50px'}}>
                            <IonRow className='ion-justify-content-center'>
                                <IonCol>
                                    {userData && (
                                        <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>Selamat datang, {userData.firstName}</h1>
                                    )}
                                    <IonLabel className='ion-margin-top' style={{ lineHeight: '1.5', color: 'gray', fontSize:'20px'}}>
                                    See what you can do today<br />
                                    </IonLabel>
                                    <IonButton strong routerLink='/admin/tableList' size='default' shape='round' className='ion-margin-top ion-margin-bottom' style={{ textTransform: 'none' }}>Table List</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines='none'>
                        <IonGrid>
                            <IonRow className='ion-justify-content-center'>
                                <IonCol size='4' sizeSm='4' sizeMd='3' sizeLg='3' sizeXl='2'>
                                    <IonCard color={'light'}>
                                        <IonCardHeader>
                                            <IonIcon size='large' icon={peopleOutline} ></IonIcon>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <IonCardTitle className='ion-margin-bottom '>Total Users</IonCardTitle>
                                            <IonCardTitle>{countAllUser}</IonCardTitle>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                                <IonCol size='4' sizeSm='4' sizeMd='3' sizeLg='3' sizeXl='2'>
                                    <IonCard color={'light'}>
                                    <IonCardHeader>
                                            <IonIcon size='large' icon={calendarOutline} ></IonIcon>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <IonCardTitle className='ion-margin-bottom'>Total Konseling</IonCardTitle>
                                            <IonCardTitle>{countAllSchedule}</IonCardTitle>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                                <IonCol size='4' sizeSm='4' sizeMd='3' sizeLg='3' sizeXl='2'>
                                    <IonCard color={'light'}>
                                    <IonCardHeader>
                                            <IonIcon size='large' icon={newspaperOutline} ></IonIcon>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <IonCardTitle className='ion-margin-bottom'>Total News</IonCardTitle>
                                            <IonCardTitle>{countAllNews}</IonCardTitle>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
        )}
        </>
    );
};

export default DashboardAdmin;
