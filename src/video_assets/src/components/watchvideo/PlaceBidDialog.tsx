import React, { ChangeEvent, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from "@material-ui/core";

interface PlaceBidDialogProps {
    open: boolean;
    handleClose: (bid: number) => void;
}

export default function PlaceBidDialog(props: PlaceBidDialogProps) {

    const [bid, setBid] = useState(0);

    const handleBidChange = (event: ChangeEvent<HTMLInputElement>) => {
        let targetValue = parseInt(event.target.value);
        if (bid !== targetValue) {
            setBid(targetValue);
        }
    }

    const handleCancel = () => {
        props.handleClose(0);
    }

    const handleBid = () => {
        if (bid >= 0) {
            props.handleClose(bid);
        }
    }

    return (
        <Dialog open={props.open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Place a bid</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can set your bid amount
                </DialogContentText>
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleBidChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleBid} color="secondary">
                    Bid
                </Button>
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}