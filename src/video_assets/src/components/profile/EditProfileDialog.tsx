import React, { ChangeEvent, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button, CircularProgress } from "@material-ui/core";
import { ProfileUpdate } from "../../interfaces/profile_interface";

import { updateProfile } from '../../services/profile_service';

interface RegisterDialogProps {
    open: boolean;
    handleClose: (reloadProfile: boolean) => void;
}

export default function RegisterDialog(props: RegisterDialogProps) {

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (username !== event.target.value) {
            setUsername(event.target.value);
        }
    }

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (bio !== event.target.value) {
            setBio(event.target.value)
        }
    }

    const handleCancel = () => {
        props.handleClose(false);
    }

    const handleEdit = async () => {
        // TODO Perform check for valid parameters
        let profileUpdate: ProfileUpdate = {
            name: username,
            bio: bio
        };
        setLoading(true);
        await updateProfile(profileUpdate);
        setLoading(false);
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
                    variant="outlined"
                    defaultValue={username}
                    fullWidth
                    onChange={handleUsernameChange}
                />
                <TextField
                    id="bio"
                    label="Bio"
                    margin="dense"
                    multiline
                    rows={4}
                    defaultValue={bio}
                    variant="outlined"
                    fullWidth
                    onChange={handleBioChange}
                />
            </DialogContent>
            <DialogActions>
                {
                    loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Button onClick={handleEdit} color="primary">
                                Edit
                            </Button>
                            <Button onClick={handleCancel} color="primary">
                                Cancel
                            </Button>
                        </>
                    )
                }

            </DialogActions>
        </Dialog>
    );
}