import { IonAlert, IonLoading } from "@ionic/react";
import { useEffect, useState } from "react";
import { deleteDocumentById } from "../../firebase/ConsultHandling";

export const AlertDelete = (data:any, onClose: any) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(true);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    useEffect(() => {
        showDeleteConfirmation(data.data.idKonseling);
        console.log('data.data.idkonseling: ', data.data.idKonseling);
    }, []);

    const showDeleteConfirmation = (documentId: any) => {
        setDocumentToDelete(documentId);
        setShowDeleteAlert(true);
      };
    
      // Fungsi untuk menutup alert konfirmasi penghapusan
      const closeDeleteAlert = () => {
        setDocumentToDelete(null);
        setShowDeleteAlert(false);
      };

      const handleCloseAlert = () => {
        setShowDeleteAlert(false);
        setDocumentToDelete(null);
        data.onClose();
      };

      const handleDeleteConfirmed =  async() => {
        if (documentToDelete) {
            console.log('Document to delete: ', documentToDelete);
            await deleteDocumentById(documentToDelete);
        }
        closeDeleteAlert();
        data.onClose();
        location.reload();
      };

    return (
        <>
        <IonAlert
            isOpen={showDeleteAlert}
            onDidDismiss={closeDeleteAlert}
            header={'Konfirmasi Penghapusan'}
            message={'Apakah Anda yakin ingin menghapus dokumen ini?'}
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