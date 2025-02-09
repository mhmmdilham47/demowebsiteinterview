import React, { createContext, useContext, useState } from 'react';
import firebase from 'firebase/app';
import firestore from 'firebase/firestore';

export interface News {
  content: string, 
  createdAt: firestore.Timestamp,
  description: string,
  idNews: string, 
  imageUrl: string,
  publisher: string,
  title: string,
}

export interface User {
  role: string,
  id: string,
  password: string,
  firstName: string,
  lastName: string,
  noHP: string,
  email: string,
  departemen: string,
}

export interface Konseling {
  idKonseling: string,
  idKonsulen: string,
  idKonsultan: string,
  jurusan: string,
  namaKonsulen: string,
  namaKonsultan: string,
  topik: string,
  jadwal: firestore.Timestamp,
  deskripsiSingkat: string,
  status: string,
}

interface DataContextProps {
  dataDosen: User[];
  setDataDosen: React.Dispatch<React.SetStateAction<User[]>>;
  dataMahasiswa: User[];
  setDataMahasiswa: React.Dispatch<React.SetStateAction<User[]>>;
  dataAdmin: User[];
  setDataAdmin: React.Dispatch<React.SetStateAction<User[]>>;
  getAllData: (roleType: string) => User[];
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FunctionComponent<{ children?: React.ReactNode }> = ({ children }) => {
    const [dataDosen, setDataDosen] = useState<User[]>([
        {
            role: "Dosen",
            id: "123456789112345678",
            password: "dosen1",
            firstName: "Dosen",
            lastName: "Contoh Data",
            noHP: "081234567890",
            email: "contoh_dosen@gmail.com",
            departemen: "Teknik Informatika",
        },
    ]);

    const [dataMahasiswa, setDataMahasiswa] = useState<User[]>([
        {
            role: "Mahasiswa",
            id: "D121211000",
            password: "mahasiswa",
            firstName: "Mahasiswa",
            lastName: "Contoh Data",
            noHP: "081234567890",
            email: "contoh_mahasiswa@gmail.com",
            departemen: "Teknik Informatika",
        }
    ]);

    const [dataAdmin, setDataAdmin] = useState<User[]>([
        {
            role: "Admin",
            id: "admin",
            password: "admin1",
            firstName: "Admin",
            lastName: "Contoh Data",
            noHP: "081234567890",
            email: "contoh_admin@gmail.com",
            departemen: "",
        }
    ]);

  const getAllData = (roleType: string) => {
    const allData = [...dataDosen, ...dataMahasiswa, ...dataAdmin];
    return allData;
  };

  const updateDataDosen = (newData: any) => {
    const data = [...dataDosen, newData];
    setDataDosen(data);
  };
  const updateDataMahasiswa = (newData: any) => {
    const data = [...dataMahasiswa, newData];
    setDataMahasiswa(data);
  };
  const updateDataAdmin = (newData: any) => {
    const data = [...dataAdmin, newData];
    setDataAdmin(data);
  };

  const value = {
    dataDosen,
    setDataDosen: updateDataDosen,
    dataMahasiswa,
    setDataMahasiswa: updateDataMahasiswa,
    dataAdmin,
    setDataAdmin: updateDataAdmin,
    getAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
