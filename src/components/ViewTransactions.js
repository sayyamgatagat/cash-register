import React, { useEffect, useState } from "react";
import firebase from "../firebase";
import Transaction from "./transaction";

function ViewTransaction() {
    const [transactions, setTransactions] = useState([]);

    const ref = firebase.firestore().collection("transactions");

    function getTransactions() {
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((transaction) => {
                items.push(transaction.data());
            });
            console.log(items);
            setTransactions(items.reverse());
        });
    }

    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <div className="transactionGroup">
            {transactions &&
                transactions.map((transaction, index) => (
                    <Transaction
                        key={index}
                        amount={transaction.amount}
                        type={transaction.type}
                        remark={transaction.remark}
                        date={transaction.date}
                        amountType={
                            transaction.amount >= 0 ? "positive" : "negative"
                        }
                    />
                ))}
        </div>
    );
}

export default ViewTransaction;
