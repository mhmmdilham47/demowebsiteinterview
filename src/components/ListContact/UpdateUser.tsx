import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react";
import { ListJurusan } from "../Schedule/ListJurusan";
import { User } from "../../context/UserDataContext";
import { createUser, getUsersByIDReturnUID, updateUserByDocId } from "../../firebase/UsersHandling";

export const UpdateUserModal = (dataUser: any, uid: string) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [namaDepan, setNamaDepan] = useState<string>(dataUser.data.firstName ||'');
    const [namaBelakang, setNamaBelakang] = useState<string>(dataUser.data.lastName ||'');
    const [userId, setUserID] = useState<string>(dataUser.data.id ||'');
    const [roleUser, setRoleUser] = useState<string>(dataUser.data.role ||'');
    const [password, setPassword] = useState<string>(dataUser.data.password);
    const [departemen, setDepartemen] = useState(dataUser.data.departemen ||'');
    const [noHp, setNoHp] = useState<string>(dataUser.data.noHP ||'');
    const [email, setEmail] = useState<string>(dataUser.data.realEmail ||'');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [presentToast] = useIonToast();
    const [present, dismiss] = useIonLoading();
    const [updateData, setUpdateData] = useState(dataUser.data);
    const [docUid, setDocUid] = useState<string>('');

    useEffect(() => {
        setUpdateData(dataUser.data);
        const fetchUID = async (id: string) => {
            try {
                const data = await getUsersByIDReturnUID(id);
                if(data){
                    const uid = data.uid;
                    console.log("uid: ", uid);
                    setDocUid(uid);
                }
            } catch (error) {
                console.error('Error fetch UID: ', error);
                throw error;
            }
        }
        fetchUID(dataUser.data.id);
        console.log('uid use effect modal: ', docUid);
    }, []);

    const handleCloseModal = () => {
        setTimeout(() => {
            handleFinishCreate();
        }, 3000);
        setIsModalOpen(false);
        dataUser.onClose();
    };
    const handleFinishCreate = () => {
        setNamaDepan('');
        setNamaBelakang('');
        setUserID('');
        setRoleUser('');
        setPassword('');
        setDepartemen('');
        setNoHp('');
        setEmail('');
    }

    const validateForm = () => {
        const errors: string [] = [];
        setTimeout(() => {
            if(!namaDepan || namaDepan.length<1){
                errors.push('Nama Depan harus diisi');
            }
            if(!namaBelakang || namaBelakang.length<1){
                errors.push('Nama Belakang harus diisi');
            }
            if(!userId || userId.length<1){
                errors.push('ID User harus diisi');
            }
            if(!roleUser || roleUser.length<1){
                errors.push('Role User harus diisi');
            }
            if(!noHp || noHp.length<1){
                errors.push('No. Hp harus diisi');
            }
        
            if(!email || email.length<1){
                errors.push('Email harus diisi');
            }
        }, 4000);
        setErrorMessages(errors);

        return (errors.length===0);
    };

    const submit = async (event: any) => {
        event.preventDefault();
        await present('Updating User');
        
        const valid = validateForm();
        console.log(valid);

        if(valid){
            console.log("Form Valid");

            const data = {
                departemen: departemen,
                email: `${userId}@bkm.com`,
                firstName: namaDepan,
                id: userId,
                lastName: namaBelakang,
                noHP: noHp,
                password: password,
                realEmail: email,
                role: roleUser,
            }
            console.log('Data user: ', data);
            console.log('uid at update modal: ', docUid);
            try {
                const res = await updateUserByDocId(docUid, data);
                setTimeout(async () => {
                    dismiss();
                    if(res){
                        presentToast({
                            message: 'User Updated Successfully',
                            duration: 3000,
                            position: 'bottom',
                            color: 'success'
                        });
                    }
                }, 3000);
            } catch (error) {
                dismiss();
                console.error('Error updating user: ', error);
                presentToast({
                    message: `Error updating user: ${error}`,
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                });
            }

        }else if(!valid){
            dismiss();
            presentToast({
                message: 'Error Update: Semua field data harus terisi',
                duration: 3000,
                position: 'bottom',
                color: 'danger'
            });
        }
        
    };

    

    return (
        <IonModal
        isOpen={isModalOpen}
        >
            <IonHeader>
                    <IonToolbar color={'secondary'}>
                      <IonTitle>Edit User</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={handleCloseModal}>Close</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className='ion-padding'>
                  <div className='ion-text-center' style={{marginBottom: '28px'}}>
                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Enter All Info</h1>
                  </div>
                    <IonList>
                      <IonGrid>
                        <IonRow >
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Role User</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonSelect value={roleUser} onIonChange={(e) => setRoleUser(e.detail.value)} placeholder="Role User">
                                <IonSelectOption value="Admin">Admin</IonSelectOption>
                                <IonSelectOption value="Dosen">Dosen</IonSelectOption>
                                <IonSelectOption value="Mahasiswa">Mahasiswa</IonSelectOption>
                            </IonSelect>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>ID User (ID/NIP/NIM)</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="text" value={userId} onIonChange={(e) => setUserID(e.detail.value!)} placeholder="NIP/NIM/ID Admin"></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Jurusan</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                            <IonSelect value={departemen} onIonChange={(e) => setDepartemen(e.detail.value)} placeholder="Departemen">
                                {ListJurusan.map((item, index) => (
                                    <IonSelectOption key={index} value={item.jurusan}>{item.jurusan}</IonSelectOption>
                                ))}
                                </IonSelect>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Nama Depan</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="text" value={namaDepan} onIonChange={(e) => setNamaDepan(e.detail.value!)} placeholder="First Name"></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Nama Belakang</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="text" value={namaBelakang} onIonChange={(e) => setNamaBelakang(e.detail.value!)} placeholder="Last Name"></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Nomor Handphone</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="text" value={noHp} onIonChange={(e) => setNoHp(e.detail.value!)} placeholder="08"></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol size='4'>
                            <IonItem lines='none'>
                              <IonLabel>Email Aktif</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} placeholder="Active Email"></IonInput>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonItem lines="none" className="ion-margin-top">
                                <IonButton size="default" onClick={submit}>Submit</IonButton>
                                <IonButton size="default" onClick={handleCloseModal}>Cancel</IonButton>
                            </IonItem>
                        </IonRow>
                        <IonRow>
                            {errorMessages.map((error, index) => (
                                <IonText key={index}>{error}</IonText>
                            ))}
                        </IonRow>
                      </IonGrid>
                    </IonList>
                  </IonContent>
        </IonModal>
    );
};