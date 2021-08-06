import React, {ChangeEvent, useState} from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from "@material-ui/core";
import { ProfileUpdate } from "../../interfaces/profile_interface";

import { updateProfile } from '../../services/profile_service';

interface RegisterDialogProps {
    open: boolean;
    handleClose: (reloadProfile: boolean) => void;
}

export default function RegisterDialog(props: RegisterDialogProps) {

    const[username, setUsername] = useState("");
    const[email, setEmail] = useState("");

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(username !==  event.target.value) {
            setUsername(event.target.value);
        }
    }

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(email !== event.target.value) {
            setEmail(event.target.value)
        }
    }

    const handleCancel = () => {
        props.handleClose(false);
    }

    const handleEdit = async () => {
        // TODO
        let profileUpdate: ProfileUpdate = {
            name: username,
            bio: "Enter bio here... :)"
        };
        await updateProfile(profileUpdate);
        props.handleClose(true);
    }

    return (
        <Dialog open={props.open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit profile</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can edit your profile settings
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="username"
                    label="Username"
                    type="username"
                    defaultValue={username}
                    fullWidth
                    onChange={handleUsernameChange}
                />
                {/** 
                 * <TextField
                    autoFocus
                    margin="dense"
                    id="email" 
                    label="E-Mail"
                    type="text"
                    defaultValue={email}
                    fullWidth
                    onChange={handleEmailChange}
                />
                */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleEdit} color="primary">
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
}