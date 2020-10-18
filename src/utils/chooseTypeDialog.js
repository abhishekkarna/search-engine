import React from 'react';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Axios from 'axios';
import { BACKEND_API_ENDPOINT } from '../env';

export class FormDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { setOpen: false, selectedType: "video" };
    }


    componentDidUpdate(prevProps) {
        if (!prevProps) return
        if (this.props.open !== prevProps.open) {
            this.setState({ setOpen: this.props.open })
        }
    }

    handleClose = () => {
        this.props.dialogHandler(false)
    };

    handleChange = (event) => {
        console.log(event.target.value)
        this.setState({ selectedType: event.target.value })
    }

    handleSave = () => {
        Axios.get(`${BACKEND_API_ENDPOINT}/download`, {
            params: {
                URL: this.props.data.url,
                type: this.state.selectedType
            }
        }).then(res => {
            console.log("res", res)
        })
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.setOpen || false} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.props.data ? this.props.data.title : ""}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Choose the format in which you want to save the result
                        </DialogContentText>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="Save type" name="saveFormat" value={this.state.selectedType} onChange={this.handleChange}>
                                <FormControlLabel value="audio" control={<Radio />} label="Audio" />
                                <FormControlLabel value="video" control={<Radio />} label="Video" />
                            </RadioGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
          </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Save
          </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
