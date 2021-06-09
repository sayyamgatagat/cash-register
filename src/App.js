import "./App.css";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { React, useState, useEffect } from "react";
import ViewTransaction from "./components/ViewTransactions";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import firebase from "./firebase";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Transaction from "./components/transaction";
import { setDate } from "date-fns";

function App() {
    const [finalDate, setFinalDate] = useState(
        new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    );
    const [selectedDate, handleDateChange] = useState(new Date());
    const [finalAmt, setFinalAmt] = useState(0);
    const [idGen, setIDgen] = useState(0);
    const ref = firebase.firestore().collection("transactions");
    const finalRef = firebase.firestore().collection("final");

    function getFinal() {
        finalRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((transaction) => {
                items.push(transaction.data());
            });
            setFinalAmt(items[0].amount);
            setIDgen(items[0].length);
        });
    }
    useEffect(() => {
        getFinal();
    }, []);
    const [transaction, setTransaction] = useState({
        amount: 0,
        remark: "",
    });
    const addTransaction = () => {
        var pad = "00000";
        const amount = parseInt(transaction.amount);
        const remark = transaction.remark;
        var options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const newdate = selectedDate.toLocaleDateString("en-IN", options);
        const type = amount >= 0 ? "credit" : "debit";
        const newTransaction = { amount, remark, date: newdate, type };
        if (!amount || !remark) {
            return window.alert("Enter valid Transaction");
        }
        if (finalAmt + amount < 0) {
            return window.alert("Not enough Balance");
        }
        const finalTransact = {
            amount: amount + finalAmt,
            date: newdate,
            length: idGen + 1,
        };
        ref.doc(
            pad.substring(0, pad.length - idGen.toString().length) +
                idGen.toString()
        )
            .set(newTransaction)
            .catch((err) => {
                console.error(err);
            });
        finalRef
            .doc("final")
            .update(finalTransact)
            .catch((err) => {
                console.error(err);
            });
        setTransaction({ amount: 0, remark: "" });
        setFinalDate(newdate);
    };

    const handleOnChange = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="container">
                <h1 className="heading">CASH REGISTER</h1>
                <div className="makeTransaction">
                    <div className="dateTime">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <KeyboardDatePicker
                                    autoOk
                                    variant="inline"
                                    className="datetime"
                                    inputVariant="outlined"
                                    format="MM/dd/yyyy"
                                    value={selectedDate}
                                    InputAdornmentProps={{ position: "start" }}
                                    onChange={(date) => handleDateChange(date)}
                                    keyboardIcon={<DateRangeIcon />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <KeyboardTimePicker
                                    ampm={true}
                                    className="datetime"
                                    variant="inline"
                                    inputVariant="outlined"
                                    value={selectedDate}
                                    InputAdornmentProps={{ position: "start" }}
                                    onChange={handleDateChange}
                                    keyboardIcon={<AccessTimeIcon />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="amount"
                                    variant="outlined"
                                    fullWidth
                                    id="amount"
                                    label="Amount"
                                    value={transaction.amount}
                                    autoFocus
                                    onChange={handleOnChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="remark"
                                    label="Remark"
                                    name="remark"
                                    value={transaction.remark}
                                    onChange={handleOnChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <label htmlFor="raised-button-file">
                                    <Button
                                        className="imageUpload"
                                        component="label"
                                        className="uploadButtons"
                                        variant="outlined"
                                        startIcon={<CameraAltIcon />}
                                    >
                                        Attach Image
                                        <input
                                            accept="image/*"
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <Transaction
                    type="final"
                    amount={finalAmt}
                    remark="Final Balance"
                    date={finalDate}
                    amountType="positive"
                />
                <ViewTransaction />
                <Button
                    onClick={addTransaction}
                    className="savebtn"
                    variant="contained"
                    color="primary"
                >
                    save
                </Button>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default App;
