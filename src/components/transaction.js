import React from "react";

function Transaction(props) {
    return (
        <div className="transactionCard ">
            <div className={props.type}>
                <h6>{props.date}</h6>
                <p className="remark">{props.remark}</p>
            </div>
            <p className={props.amountType}>{props.amount}</p>
        </div>
    );
}

export default Transaction;
