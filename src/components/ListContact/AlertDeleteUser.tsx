import { IonAlert, useIonLoading, useIonToast } from "@ionic/react";
import { useState, useEffect } from "react";
import { deleteUsersById, getUsersByIDReturnUID } from "../../firebase/UsersHandling";

export const AlertDeleteUser = (dataUser:any, onClose: any) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(true);
    const [userToDelete, setUserToDelete] = useState<string>();
    const [presentToast] = useIonToast();
    const [docUid, setDocUid] = useState<string>();
    const [present, dismiss] = useIonLoading();

    useEffect(() => {
        console.log('Datauser delete: ', dataUser);
        const fetchUID = async (id: string) => {
            try {
                const data = await getUsersByIDReturnUID(id);
                if(data){
                    const uid = data.uid;
                    console.log("uid: ", uid);
                    setDocUid(uid);
                }
                setTimeout(async () => {
                    showDeleteConfirmation(docUid);
                }, 3000)
                
            } catch (error) {
                console.error('Error fetch UID: ', error);
                throw error;
            }
        }
        fetchUID(dataUser.data.id);
        
    }, []);

    useEffect(() => {
        console.log('docUid effect', docUid);
    }, [docUid]);

    const showDeleteConfirmation = (documentId: any) => {
        setUserToDelete(documentId);
        setShowDeleteAlert(true);
      };
    
      // Fungsi untuk menutup alert konfirmasi penghapusan
      const closeDeleteAlert = () => {
        setUserToDelete('');
        setShowDeleteAlert(false);
      };

      const handleCloseAlert = () => {
        setShowDeleteAlert(false);
        setUserToDelete('');
        dataUser.onClose();
      };

      const handleDeleteConfirmed =  async () => {
        await present('Deleting User');
        console.log("docUid handleConfirmed: ", userToDelete);
        if (docUid) {
            console.log('Document to delete: ', docUid);
            try{
                const res = await deleteUsersById(docUid);
                if(res){
                    dismiss();
                    presentToast({
                        message: 'User Deleted Successfully',
                        duration: 3000,
                        position: 'bottom',
                        color: 'success'
                    });
                }
            }catch(error){
                dismiss();
                console.error('Error delete user: ', error);
                presentToast({
                    message: 'Error Delete User',
                    duration: 2000,
                    position: 'bottom',
                    color: 'danger'
                });
            }
            
        }else{
            dismiss();
                presentToast({
                    message: 'There is no uid to delete',
                    duration: 2000,
                    position: 'bottom',
                    color: 'danger'
                });
        }
        dismiss();
        closeDeleteAlert();
        dataUser.onClose();
      };

    return (
        <>
        <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={closeDeleteAlert}
            header={'Konfirmasi Penghapusan'}
            message={'Apakah Anda yakin ingin menghapus user ini?'}
            buttons={[
            {
                text: 'Batal',
                role: 'cancel',
                handler: () => {
                console.log('Penghapusan dibatalkan');
                handleCloseAlert();
                },
            },
            {
                text: 'OK',
                handler: handleDeleteConfirmed,
            },
            ]}
        />
        </>
    );
}