import { DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app, analytics, auth, db } from './firebaseConfig';
import { getUsersByIDReturnUID } from './UsersHandling';
import { Konseling, News } from '../context/UserDataContext';

export const getAllNews = async () => {
    try {
        const newsCollection = collection(db, 'news');
        const newsQuery = query(newsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(newsQuery);

        const newsData: News[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as News);
        return newsData;
    } catch (error) {
        console.error('Error get all news: ', error);
        throw error;
    }
};

export const getLatestNews = async () => {
    try {
        const newsCollection = collection(db, 'news');
        const q = query(newsCollection, orderBy('createdAt', 'desc'), limit(6));
        const querySnapshot = await getDocs(q);

        const recentNewsData: News[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as News);
        return recentNewsData;
    } catch (error) {
        console.error('Error get latest news: ', error);
        throw error;
    }
};

export const getNewsByUid = async (uid:string) => {
    try {
        const newsCollection = collection(db, 'news');
        const q = query(newsCollection, where('idNews', '==', uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
            throw new Error(`No news found with UID: ${uid}`);
          }

        const news = querySnapshot.docs[0].data();
        return news;
    } catch (error) {
        console.error('Error get news by uid: ', error)
        throw error;
    }
}

export const countNews = async () => {
    try {
        const newsCollection = collection(db, 'news');
        const newsSnapshot = await getDocs(newsCollection);
        const numberOfNews = newsSnapshot.size;
        console.log('Number of news:', numberOfNews);
        return numberOfNews;
    } catch (error) {
        console.error('Error counting news:', error);
        throw error;
    }
};

export const createNews = async (newData: any) => {
    try {
        const docRef = await addDoc(collection(db, 'news'), newData);
        const newDocId = docRef.id;
        await updateDoc(doc(db, 'news', newDocId), { idNews: newDocId });
        console.log('Berita berhasil ditambahkan dengan ID:', newDocId);
    } catch (error) {
        console.error('Error create news: ', error);
        throw error;
    }
}; 
