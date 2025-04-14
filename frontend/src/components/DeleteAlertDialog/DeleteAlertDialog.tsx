import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from "@mui/material";

interface DeleteAlertDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
    open,
    onClose,
    onConfirm,
    loading = false
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Alert</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this alert? This action
                    cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button 
                    onClick={onConfirm} 
                    color="error"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAlertDialog;
