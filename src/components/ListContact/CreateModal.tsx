import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { useState } from "react";
import { ListJurusan } from "../Schedule/ListJurusan";
import { User } from "../../context/UserDataContext";
import { createUser } from "../../firebase/UsersHandling";

export const CreateModal = (dataModal: any) => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [namaDepan, setNamaDepan] = useState<string>('');
    const [namaBelakang, setNamaBelakang] = useState<string>('');
    const [userId, setUserID] = useState<string>('');
    const [roleUser, setRoleUser] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [departemen, setDepartemen] = useState('');
    const [noHp, setNoHp] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [presentToast] = useIonToast();
    const [present, dismiss] = useIonLoading();


    const handleCloseModal = () => {
        setTimeout(() => {
            handleFinishCreate();
        }, 3000);
        setIsModalOpen(false);
        dataModal.onClose();
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
        if(!password){
            errors.push('Password User harus diisi');
        }else{
            if(password.length<6){
                errors.push('Password harus lebih dari 6 karakter');
                presentToast({
                    message: 'Password User harus lebih dari 6 karakter.',
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger',
                });
            }
        }
        if(!noHp || noHp.length<1){
            errors.push('No. Hp harus diisi');
        }
        setTimeout(() => {
            if(!email || email.length<1){
                errors.push('Email harus diisi');
            }
        }, 3000);
        setErrorMessages(errors);

        return (errors.length===0);
    };

    const submit = async (event: any) => {
        event.preventDefault();
        await present('Creating User');
        
        const valid = validateForm();
        console.log(valid);

        if(valid){
            console.log("Form Valid");

            const data = {
                departemen: departemen,
                email: `${userId}@bkm.com`,
                firstName: namaDepan,
                lastName: namaBelakang,
                id: userId,
                noHP: noHp,
                password: password,
                realEmail: email,
                role: roleUser,
            }
            console.log('Data user: ', data);
            try {
                const res = await createUser(data);
                setTimeout(async () => {
                    dismiss();
                    
                    if(res){
                        presentToast({
                            message: 'User Created Successfully',
                            duration: 3000,
                            position: 'bottom',
                            color: 'success'
                        });
                    }
                }, 3000);
                handleFinishCreate();
            } catch (error) {
                dismiss();
                console.error('Error creating user: ', error);
                presentToast({
                    message: `Error creating user: ${error}`,
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                });
            }

        }else if(!valid){
            dismiss();
            if(!password){
                presentToast({
                    message: 'Error Submit: Semua field data harus terisi',
                    duration: 3000,
                    position: 'bottom',
                    color: 'danger'
                });
            }else{
                if(password.length<6){
                    presentToast({
                        message: 'Password User harus lebih dari 6 karakter.',
                        duration: 3000,
                        position: 'bottom',
                        color: 'danger',
                    });
                }
            }  
            presentToast({
                message: 'Error Submit: Semua field data harus terisi',
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
                      <IonTitle>Create New User</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={handleCloseModal}>Close</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className='ion-padding'>
                  <div className='ion-text-center' style={{marginBottom: '28px'}}>
                    <h1 style={{ fontWeight: 'bold', color: '#3880ff', fontSize: '32px' }}>Enter all user info.</h1>
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
                            <IonSelect value={roleUser} onIonChange={(e) => setRoleUser(e.detail.value)} placeholder="Pilih Role User">
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
                              <IonLabel>Password</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size='1'>
                            <IonItem lines='none'>
                              <IonLabel>:</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                                <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} placeholder="Default Password"></IonInput>
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
                        </IonRow>
                      </IonGrid>
                    </IonList>
                  </IonContent>
        </IonModal>
    );
};