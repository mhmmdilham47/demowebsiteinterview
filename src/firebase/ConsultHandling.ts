import { DocumentReference, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app, analytics, auth, db } from './firebaseConfig';
import { getUsersByIDReturnUID } from './UsersHandling';
import { Konseling } from '../context/UserDataContext';

export const createNewKonseling = async (data: Konseling) => {
    try {
        const konselingCollection = collection(db, 'konseling');
        const newKonselingRef = await addDoc(konselingCollection, data);

        console.log('Konseling Doc added with ID: ', newKonselingRef.id);  
        const updatedData = {...data, idKonseling: newKonselingRef.id};
        await setDoc(doc(db, 'konseling', newKonselingRef.id), updatedData);
    } catch (error) {
        console.log('Error adding konseling doc: ', error);
        throw error;
    }
};

export const getAllKonseling = async () => {
    try {
        const konselingCollection = collection(db, 'konseling');
        const querySnapshot = await getDocs(konselingCollection);

        const konselingData: Konseling[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as Konseling);
        return konselingData;
    } catch (error) {
        console.log("Error get all konseling: ", error);
        throw error;
    }
};

export const getKonselingForMByUserID = async (userID: string) => {
    try {
        /*
        const user = await getUsersByIDReturnUID(userID);

        if(!user){
            console.log('User not found');
            return [];
        }

        const konselingCollection = collection(db, 'konseling');

        //query id
        const userDocRef: DocumentReference = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log('User document not found');
            return [];
        }*/
        const konselingCollection = collection(db, 'konseling');

        // Query using the user document reference
        console.log("userID: ", userID);
        const q = query(konselingCollection, where('idKonsulen', '==', userID));
        const querySnapshot = await getDocs(q);
        const konselingData: Konseling[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as Konseling);
        //console.log("user uid ", user.uid);
        console.log("konselingData handling: ", konselingData);
        return konselingData;
    } catch (error) {
        console.log('Error get Schedule');
        throw error
    }
};

export const getKonselingForDByUserID = async (userID: string) => {
    try {
        const konselingCollection = collection(db, 'konseling');

        // Query using the user document reference
        console.log("userID: ", userID);
        const q = query(konselingCollection, where('idKonsultan', '==', userID));
        const querySnapshot = await getDocs(q);
        const konselingData: Konseling[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as Konseling);
        //console.log("user uid ", user.uid);
        console.log("konselingData handling: ", konselingData);
        return konselingData;
    } catch (error) {
        console.log('Error get Schedule');
        throw error
    }
};

export const updateKonselingById = async (idKonseling: string, newData: Partial<Konseling>) => {
    try {
        const konselingDocRef = doc(db, 'konseling', idKonseling);
        await updateDoc(konselingDocRef, newData);

        console.log('Konseling document updated successfully!');
    } catch (error) {
        console.error('Error updating konseling document: ', error);
        throw error;
    }
}

export const deleteDocumentById =async (documentId:string) => {
    const konselingRef = doc(collection(db, 'konseling'), documentId);
    try {
        await deleteDoc(konselingRef);
        console.log("Dokumen berhasil dihapus: ", documentId);
        alert("Deleted successfully");
    }catch(error){
        console.error('Failed delete doc: ', error);
        alert("Delete failed")
    }
    
}

export const countKonseling = async () => {
    try {
        const schedulesCollection = collection(db, 'konseling');
        const schedulesSnapshot = await getDocs(schedulesCollection);
        const numberOfSchedules = schedulesSnapshot.size;
        console.log('Number of schedules:', numberOfSchedules);
        return numberOfSchedules;
    } catch (error) {
        console.error('Error counting schedules:', error);
        throw error;
    }
};
