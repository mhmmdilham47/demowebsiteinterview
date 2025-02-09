import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { DocumentReference, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { app, analytics, auth, db } from './firebaseConfig';
import { User } from '../context/UserDataContext';


//handle login
export const loginUser = async (userID: string, password: string) => {
    //authenticate with firebase
    const email = `${userID}@bkm.com`;

    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        
        console.log(res);
        const userData = await getUserByUID(res.user.uid);
        console.log('User Data: ', userData);
        return userData;

    }catch(error){
        console.log(error);
        return false;
    }
}

//getspecificuser
export const getUserByUID = async (uid: string) => {
    const userRef = doc(db, 'users', uid);//atau doc(db, `users/${uid}`)

    try {
        const userDoc = await getDoc(userRef);

        if(userDoc.exists()){
            return userDoc.data();
        }else{
            console.log('User document not found');
            return ;
        }
    } catch (error) {
        console.log('Error getting user doc: ', error);
        throw error;
    }
};

//Create a user
export const createUser = async (newUserData: any) => {
    const { 
        departemen,
        email,
        firstName,
        lastName,
        id,
        noHP,
        password,
        realEmail,
        role,
    } = newUserData;

    try {

        const authResult = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = authResult.user;

        const userDocRef = doc(db, 'users', uid);
        
        await setDoc(userDocRef, newUserData);
        console.log('User created successfully! ', uid);
        return true;
    } catch (error) {
        console.error('Error creating user: ', error);
        throw error;
    }
};

//get users by its role
export const getUsersByRole = async (roleType: string) => {
    try{
        const usersCollection = collection(db, 'users');

        //query
        const q = query(usersCollection, where('role', '==', roleType));
        const querySnapshot = await getDocs(q);
        const users: User[] = querySnapshot.docs.map((doc) => ({...doc.data()}) as User);
        return users;
    }catch(error){
        console.log('Error getting users: ', error);
        throw error;
    }
};

export const getUsersByIDReturnUID = async (id: string) => {
    try {
        const usersCollection = collection(db, 'users');

        //query
        const q = query(usersCollection, where('id', '==', id));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as User;

        const userWithUid = {
            ...userData,
            uid: userDoc.id,
        };

        console.log("User with uid: ", userWithUid);
        return userWithUid;
    } catch (error) {
        console.log('Error getting users ID: ', error);
        throw error;
    }
};

export const getUsersByID = async (userID: string) => {
    try {
        const usersCollection = collection(db, 'users');

        const q = query(usersCollection, where('id', '==', userID));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const userData = querySnapshot.docs[0].data() as User;
            return userData;
        } else {
            return undefined; // Or handle the case where user is not found
        }
    } catch (error) {
        console.log('Error get users by id: ', error);
        throw error;
    }
};
export const getUserByRef = async (ref: string) => {
    try {
        const konsultanDocRef = doc(db, ref);
        const konsultanDocSnapshot = await getDoc(konsultanDocRef);

        if (konsultanDocSnapshot.exists()) {
        const konsultanData = konsultanDocSnapshot.data();
        console.log('Data Konsultan:', konsultanData);
        // Lakukan sesuatu dengan data konsultan, misalnya mengambil nama
        const konsultanName = `${konsultanData.firstName} ${konsultanData.lastName}`;
        const data = {
            firstName: konsultanData.firstName,
            lastName: konsultanData.lastName,
        }
        //return konsultanName;
        return data;
        } else {
        console.log('Konsultan tidak ditemukan');
        return ;
        }
        /*
        const userDocSnapshot = await getDoc(ref);
        if(!userDocSnapshot.exists()){
            //return [];
            throw new Error('User document not found');
        }

        const userData = userDocSnapshot.data();
        if (!userData) {
            throw new Error('User data not found');
          }
      
        const userDataTyped = userData as User;
        return userDataTyped;*/
    } catch (error) {
        console.log('Error getting user by ref:', error);
        throw error;
    }
};

export const updateUserByDocId = async (idDocUsers: string, newData: any) => {
    try {
        
        const usersCollection = collection(db, 'users');
        const usersDocRef = doc(usersCollection, idDocUsers);
        console.log("usersdocref: ", usersDocRef);
        console.log('uid update: ', idDocUsers);
        console.log('new data update: ', newData);
        await updateDoc(usersDocRef, newData);

        console.log('Users updated succesfully');
        return true;

    } catch (error) {
        console.error('Error update Users: ', error);
        return false;
    }
}

export const deleteUsersById = async (documentId: string) => {
    const usersRef = doc(collection(db, 'users'), documentId);
    try {
        await deleteDoc(usersRef);
        console.log("dokumen berhasil dihapus: ", documentId);
        return true;
    } catch (error) {
        console.error('Failed delete users: ', error);
        return false;
    }
};

export const countUsers = async () => {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const numberOfUsers = usersSnapshot.size;
        console.log('Number of users:', numberOfUsers);
        return numberOfUsers;
    } catch (error) {
        console.error('Error counting users:', error);
        throw error;
    }
};

export const countUsersByRole = async (role: string) => {
    try {
        const usersCollection = collection(db, 'users');
        const usersQuery = query(usersCollection, where('role', '==', role));
        const usersSnapshot = await getDocs(usersQuery);
        const numberOfUsers = usersSnapshot.size;
        console.log(`Number of users with role ${role}:`, numberOfUsers);
        return numberOfUsers;
    } catch (error) {
        console.error(`Error counting users with role ${role}:`, error);
        throw error;
    }
};

export const updateUserById = async (userId: string, newData: any) => {
    try {
        const q = query(collection(db, 'users'), where('id', '==', userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.error('User tidak ditemukan');
            return;
          }
      
          // Mendapatkan referensi dokumen pertama yang sesuai dengan query
          const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);
          console.log('qsnap[0].id: ', querySnapshot.docs[0].id)
          
          // Melakukan pembaruan dokumen dengan data baru
          await updateDoc(userDocRef, newData);
      
          console.log('User berhasil diperbarui');
    } catch (error) {
        console.error('Error update user: ', error);
        throw error;
    }
};
