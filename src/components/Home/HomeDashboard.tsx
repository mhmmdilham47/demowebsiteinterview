import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFooter, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonNote, IonPage, IonRouterLink, IonRow, IonSelect, IonSelectOption, IonText, IonTextarea, IonTitle, IonToolbar, IonicSlides } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import './HomeDashboard.css';
import { Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import { briefcaseOutline, calendarOutline, chatbubblesOutline, eyeOutline, footballOutline, libraryOutline, listCircleOutline, peopleOutline, personOutline, schoolOutline } from 'ionicons/icons';
import  BannerDashboard from "../../assets/istockphoto-1461586589-612x612.jpg";
import consult from '../../assets/Intro/job-interview-conversation_74855-7566.webp';
import consult2 from '../../assets/people-talking-concept-illustration_114360-6852.webp';
import news1 from '../../assets/photo-1477281765962-ef34e8bb0967.webp';
import news2 from '../../assets/photo-1698421823571-bf9617fab3ff.webp';
import news3 from '../../assets/photo-1669115380104-886eeab91820.webp';
import logoUnhas from '../../assets/unhas logo.jpg';
import { getLatestNews } from '../../firebase/NewsHandling';
import { News } from '../../context/UserDataContext';
import NotFound from '../../pages/NotFoundPage';

const HomeDashboard: React.FC = () => {
    const [userData, setUserData] = useState<any | null>(null);
    const [recentNewsData, setRecentNewsData] = useState<News[]>([]);

    const layanan = [
        {icon: personOutline, title: "Konseling Individu"},
        {icon: peopleOutline, title: "Konseling Kelompok"},
        {icon: libraryOutline, title: "Konseling Akademik"},
        {icon: schoolOutline, title: "Konseling Beasiswa"},
        {icon: footballOutline, title: "Minat & Bakat"},
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
        }else{
           // mengarah ke halaman notFound
           setUserData(null);
        }

        const fetchRecentNews = async () => {
            try {
                const recentNews = await getLatestNews();
                setRecentNewsData(recentNews);
            } catch (error) {
                console.error('Error fetch recent  news: ', error);
                throw error;
            }
        };
        fetchRecentNews();
      }, []);

    return (
        <>
        {!userData ? (
            <NotFound />
        ) : (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonButtons slot='start'>
                        <IonMenuButton autoHide={false}/>
                    </IonButtons>
                    <IonTitle className='ion-text-center'>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color={'light'}>
                {/** 
                <div className='dashboard-banner'>
                    <IonImg src={BannerDashboard} alt='Consultation Picture' class='dashboard-banner-picture'>
                    </IonImg>
                    <div className='dashboard-banner-text-button'>
                        {userData && (
                            <IonText color={'dark'} class='banner-text headertitle'>Welcome, {userData.firstName}</IonText>
                        )}
                            <IonLabel class='banner-text subtitle' className='ion-margin-top banner-text subtitle' style={{color: 'white'}}>
                                Bimbingan dan Konseling Mahasiswa (BKM),
                                tempat kamu bisa menceritakan masalahmu dengan aman
                            </IonLabel>
                            <IonButton strong routerLink='/app/schedule' size='default' shape='round' className='ion-margin-top' style={{ textTransform: 'none' }}>Cerita Sekarang</IonButton>
                    </div>
                </div>*/}
                <IonList className='ion-margin-bottom'>
                    <IonItem lines='full' className='ion-margin-vertical ion-padding banner-text' >
                        <IonGrid style={{paddingBottom: '50px'}}>
                            <IonRow className='ion-justify-content-center'>
                                <IonCol>
                                    {userData && (
                                        <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '36px' }}>Selamat datang, {userData.firstName}</h1>
                                    )}
                                    <IonLabel className='ion-margin-top' style={{ lineHeight: '1.5', color: 'gray', fontSize:'20px'}}>
                                    Bimbingan dan Konseling Mahasiswa (BKM),<br />
                                    tempat kamu bisa menceritakan masalahmu dengan aman<br />
                                    </IonLabel>
                                    <IonButton strong routerLink='/app/schedule' size='default' shape='round' className='ion-margin-top ion-margin-bottom' style={{ textTransform: 'none' }}>Cerita Sekarang</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines='none' className='ion-margin-vertical ion-padding-bottom'>
                        <IonGrid className='ion-padding-horizontal'>
                            <IonRow className='ion-justify-content-center'>
                                
                                <IonCol size='8' sizeSm='6' sizeMd='5' sizeLg='4' sizeXl='4'>
                                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Apa itu BKM UNHAS?</h1>
                                    <IonLabel className='ion-margin-top ion-text-wrap' style={{ lineHeight: '1.5', color: 'gray', fontSize:'18px'}}>
                                    BKM memberikan kemudahan kepada 
                                    mahasiswa Universitas Hasanuddin 
                                    untuk menceritakan dan mengkonsultasikan 
                                    masalah dan kendala mereka dalam lingkup 
                                    perkuliahan, minat dan bakat, karir, dan
                                    sebagainya kepada dosen konselor berpengalaman.
                                    </IonLabel>
                                </IonCol>
                                <IonCol size='6' sizeSm='5' sizeMd='5' sizeLg='4' sizeXl='4'>
                                    <img src={consult2}></img>
                                </IonCol>
                                
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines='none' color={'light'} className='ion-margin-vertical ion-padding-top ion-padding-bottom'>
                        <IonGrid>
                            <IonRow className='ion-text-center ion-align-item-center ion-margin-vertical'>
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>
                                        Layanan BKM UNHAS
                                    </h1>
                                </div>
                            </IonRow>
                            <IonRow className='ion-justify-content-center'>
                                {group1.map((item, index) => (
                                    <IonCol key={index} size='4' sizeSm='4' sizeMd='3' sizeLg='3' sizeXl='3'>
                                        <IonCard className='ion-padding-vertical ion-margin-horizontal'>
                                            <IonCardHeader>
                                                <IonCardTitle className='ion-text-center'>
                                                    <IonIcon color={'primary'} size='large' icon={item.icon}></IonIcon>
                                                </IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonTitle className='ion-text-center ion-text-wrap'>{item.title}</IonTitle>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                ))}
                            </IonRow>
                            <IonRow className='ion-justify-content-center'>
                                {group2.map((item, index) => (
                                    <IonCol key={index} size='4' sizeSm='4' sizeMd='3' sizeLg='3' sizeXl='3'>
                                        <IonCard className='ion-padding-vertical ion-margin-horizontal'>
                                            <IonCardHeader>
                                                <IonCardTitle className='ion-text-center'>
                                                    <IonIcon icon={item.icon} size='large' color={'primary'}></IonIcon>
                                                </IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonTitle className='ion-text-center ion-text-wrap'>{item.title}</IonTitle>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                ))}
                            </IonRow>
                            <IonRow className='ion-justify-content-center'>
                                
                                {group3.map((item, index) => (
                                    <IonCol key={index} size='8' sizeSm='8' sizeMd='6' sizeLg='4' sizeXl='4'>
                                        <IonCard className='ion-padding-vertical ion-margin-horizontal'>
                                            <IonCardHeader>
                                                <IonCardTitle className='ion-text-center'>
                                                    <IonIcon icon={item.icon} size='large' color={'primary'}></IonIcon>
                                                </IonCardTitle>
                                            </IonCardHeader>
                                            <IonCardContent>
                                                <IonTitle className='ion-text-center ion-text-wrap'>{item.title}</IonTitle>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                ))}
                                
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                    <IonItem lines='none' className='ion-padding-top ion-padding-bottom'>
                        <IonGrid style={{paddingBottom: '32px'}}>
                            <IonRow className='ion-justify-content-center'>
                                <IonCol size='8' sizeSm='6' sizeMd='5' sizeLg='4' sizeXl='4'>
                                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Konselor dan Dosen BKM</h1>
                                    <IonLabel className='ion-margin-top ion-margin-bottom ion-text-wrap' style={{ lineHeight: '1.5', color: 'gray', fontSize:'18px'}}>
                                    Para pembimbing dan konselor di BKM Unhas 
                                    siap mendengarkan, membimbing, dan membantu 
                                    para mahasiswa yang tengah menghadapi kendala
                                    baik pada lingkup di dalam maupun di luar kampus.
                                    </IonLabel>
                                    <IonButton strong routerLink='/app/UserList' size='default' shape='round' className='ion-margin-top' style={{ textTransform: 'none' }}>Semua Konselor</IonButton>
                                </IonCol>
                                <IonCol size='6' sizeSm='5' sizeMd='5' sizeLg='4' sizeXl='4'>
                                    <img src={consult}></img>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                </IonList>
                <div style={{ width: '100%', textAlign: 'center'}}>
                        <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>
                            Kabar Terkini
                        </h1>
                </div>
                <div style={{maxHeight: '730px'}}>
                <Swiper
                spaceBetween={30} 
                slidesPerView={3}
                className='ion-margin-start'
                style={{ height: '80%'}}
                
                >
                    {recentNewsData.map((item, index) => (
                        <SwiperSlide key={index} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <IonCard className='ion-margin-bottom ion-padding-bottom'>
                            <img src={item.imageUrl} alt={item.title} style={{width: '350px', height: '180px', objectFit: 'cover'}}></img>
                            <IonCardHeader>
                                <IonCardTitle>{item.title}</IonCardTitle>
                                <IonCardSubtitle>{item.publisher}</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent className='ion-padding-bottom'>
                                <IonNote className='ion-text-wrap'>{!item.description ? "There is no description" : item.description}</IonNote>
                            </IonCardContent>
                        </IonCard>
                    </SwiperSlide>
                    ))}
                    {/*dataNewsCarousel.map((item, index) => (
                        <SwiperSlide key={index} style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <IonCard className='ion-padding ion-margin-bottom'>
                                <img src={item.image} alt={item.title} style={{width: '300px', height: '150px', objectFit: 'cover'}}></img>
                                <IonCardHeader>
                                    <IonCardTitle>{item.title}</IonCardTitle>
                                    <IonCardSubtitle>{item.publisher}</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonNote>{item.content}</IonNote>
                                </IonCardContent>
                            </IonCard>
                        </SwiperSlide>
                    ))*/}
                </Swiper>
                <IonItem lines='none' color={'light'} className='ion-margin-bottom'>
                    <IonNote slot='end' style={{fontSize: '14px'}}>Scroll to see..</IonNote>
                </IonItem>
                <IonRow className='ion-justify-content-center'>
                    <IonButton strong routerLink='/app/news' className='ion-margin-bottom' shape='round' size='default' style={{ textTransform: 'none' }}>Semua Berita</IonButton>
                </IonRow>
                </div>
                <IonItem lines='full' color={'light'}>
                </IonItem>
                <IonItem lines='none'>
                    <IonGrid className='ion-margin-top ion-margin-bottom'>
                        <IonRow className='ion-margin-start ion-margin-end'>
                            <IonCol size='4' className='ion-text-center ion-align-item-center ion-margin-top'>
                                <IonImg src={logoUnhas} style={{ width: '30%', height: 'auto', margin: 'auto'}}>
                                </IonImg>
                                <IonLabel className='ion-margin-top'>Universitas Hasanuddin</IonLabel>
                            </IonCol>
                            <IonCol>
                                <h2 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '26px' }}>
                                    Tentang Kami
                                </h2>
                                    <IonLabel className='ion-margin-bottom'>
                                        <IonRouterLink color={'dark'} href='https://www.unhas.ac.id/vision-and-mission/'>Visi & Misi</IonRouterLink>
                                    </IonLabel>
                                    <IonLabel>
                                        <IonRouterLink color={'dark'} href='https://www.unhas.ac.id/brief-history/'>Sejarah Singkat</IonRouterLink>
                                    </IonLabel>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItem>
            </IonContent>
        </IonPage>
        )}
        </>
    );
};

export default HomeDashboard;
