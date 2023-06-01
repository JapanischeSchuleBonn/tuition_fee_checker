import { MemberManager } from "./member_manager.js";
import { TransactionManager } from "./transaction_manager.js";
import { MatchedRecord } from "./matched_record.js";
import { Report } from "./report.js";
let memberManager = null;
let transactionManager = null;
const renderAbsentMembers = (tableAbsentMembers, absentMembersStat, absentMembers) => {
    tableAbsentMembers.innerHTML = "";
    absentMembers.forEach((member) => {
        let tableRow = document.createElement("tr");
        let tableDataLastNameInJapanese = document.createElement("td");
        tableDataLastNameInJapanese.append(member.nameInJapanese.lastName);
        tableRow.append(tableDataLastNameInJapanese);
        let tableDataFirstNameInJapanese = document.createElement("td");
        tableDataFirstNameInJapanese.append(member.nameInJapanese.firstName);
        tableRow.append(tableDataFirstNameInJapanese);
        let tableDataNumChildren = document.createElement("td");
        tableDataNumChildren.append(member.childrenState.numChildren.toString());
        tableRow.append(tableDataNumChildren);
        let tableDataNumAbsentChildren = document.createElement("td");
        tableDataNumAbsentChildren.append(member.childrenState.numAbsentChildren.toString());
        tableRow.append(tableDataNumAbsentChildren);
        tableAbsentMembers.append(tableRow);
    });
    absentMembersStat.textContent = " (" + absentMembers.length.toString() + "/" + memberManager.members.length.toString() + ")";
};
const renderUnpaidMembers = (tableUnpaidMembers, unpaidMembersStat, unpaidMembers) => {
    tableUnpaidMembers.innerHTML = "";
    unpaidMembers.forEach((member) => {
        let tableRow = document.createElement("tr");
        let tableDataLastNameInJapanese = document.createElement("td");
        tableDataLastNameInJapanese.append(member.nameInJapanese.lastName);
        tableRow.append(tableDataLastNameInJapanese);
        let tableDataFirstNameInJapanese = document.createElement("td");
        tableDataFirstNameInJapanese.append(member.nameInJapanese.firstName);
        tableRow.append(tableDataFirstNameInJapanese);
        let tableDataPartnerLastName = document.createElement("td");
        tableDataPartnerLastName.append(member.partner.name.lastName);
        tableRow.append(tableDataPartnerLastName);
        tableUnpaidMembers.append(tableRow);
    });
    unpaidMembersStat.textContent = " (" + unpaidMembers.length.toString() + "/" + memberManager.members.length.toString() + ")";
};
const renderWrongAmountMembers = (tableWrongAmountMembers, wrongAmountMembersStat, matchedRecord) => {
    tableWrongAmountMembers.innerHTML = "";
    matchedRecord.forEach((matchedRecord) => {
        let tableRow = document.createElement("tr");
        const member = matchedRecord.member;
        const transaction = matchedRecord.transactions[0];
        let tableDataLastNameInJapanese = document.createElement("td");
        tableDataLastNameInJapanese.append(member.nameInJapanese.lastName);
        tableRow.append(tableDataLastNameInJapanese);
        let tableDataFirstNameInJapanese = document.createElement("td");
        tableDataFirstNameInJapanese.append(member.nameInJapanese.firstName);
        tableRow.append(tableDataFirstNameInJapanese);
        let tableDataPartnerLastName = document.createElement("td");
        tableDataPartnerLastName.append(member.partner.name.lastName);
        tableRow.append(tableDataPartnerLastName);
        let tableDataRequiredAmount = document.createElement("td");
        tableDataRequiredAmount.classList.add("amount");
        tableDataRequiredAmount.append(member.childrenState.getQuarterlyTuition().toString());
        tableRow.append(tableDataRequiredAmount);
        let tableDataPaidAmount = document.createElement("td");
        tableDataPaidAmount.classList.add("amount");
        tableDataPaidAmount.append(transaction.amount.toString());
        tableRow.append(tableDataPaidAmount);
        let tableDataDifference = document.createElement("td");
        tableDataDifference.classList.add("amount");
        const difference = transaction.amount - member.childrenState.getQuarterlyTuition();
        const difText = difference < 0 ? Math.abs(difference).toString() + "不足" : difference.toString() + "余剰";
        tableDataDifference.append(difText);
        tableRow.append(tableDataDifference);
        let tableDataDate = document.createElement("td");
        tableDataDate.append(transaction.date.toISOString().split('T')[0]);
        tableRow.append(tableDataDate);
        let tableDataPayerName = document.createElement("td");
        tableDataPayerName.append(transaction.payer);
        tableRow.append(tableDataPayerName);
        let tableDataPurpose = document.createElement("td");
        tableDataPurpose.append(transaction.purpose.toString());
        tableRow.append(tableDataPurpose);
        tableWrongAmountMembers.append(tableRow);
    });
    wrongAmountMembersStat.textContent = " (" + matchedRecord.length.toString() + "/" + memberManager.members.length.toString() + ")";
};
const renderInvalidMembers = (tablePaidMembers, invalidMembersStat, members) => {
};
const renderPaidMembers = (tablePaidMembers, paidMembersStat, matchedRecord) => {
    tablePaidMembers.innerHTML = "";
    matchedRecord.forEach((matchedRecord) => {
        let tableRow = document.createElement("tr");
        const member = matchedRecord.member;
        const transaction = matchedRecord.transactions[0];
        let tableDataLastNameInJapanese = document.createElement("td");
        tableDataLastNameInJapanese.append(member.nameInJapanese.lastName);
        tableRow.append(tableDataLastNameInJapanese);
        let tableDataFirstNameInJapanese = document.createElement("td");
        tableDataFirstNameInJapanese.append(member.nameInJapanese.firstName);
        tableRow.append(tableDataFirstNameInJapanese);
        let tableDataPartnerLastName = document.createElement("td");
        tableDataPartnerLastName.append(member.partner.name.lastName);
        tableRow.append(tableDataPartnerLastName);
        let tableDataRequiredAmount = document.createElement("td");
        tableDataRequiredAmount.classList.add("amount");
        tableDataRequiredAmount.append(member.childrenState.getQuarterlyTuition().toString());
        tableRow.append(tableDataRequiredAmount);
        let tableDataPaidAmount = document.createElement("td");
        tableDataPaidAmount.classList.add("amount");
        tableDataPaidAmount.append(transaction.amount.toString());
        tableRow.append(tableDataPaidAmount);
        let tableDataDate = document.createElement("td");
        tableDataDate.append(transaction.date.toISOString().split('T')[0]);
        tableRow.append(tableDataDate);
        let tableDataPayerName = document.createElement("td");
        tableDataPayerName.append(transaction.payer);
        tableRow.append(tableDataPayerName);
        let tableDataPurpose = document.createElement("td");
        tableDataPurpose.append(transaction.purpose.toString());
        tableRow.append(tableDataPurpose);
        tablePaidMembers.append(tableRow);
    });
    paidMembersStat.textContent = " (" + matchedRecord.length.toString() + "/" + memberManager.members.length.toString() + ")";
};
const renderResult = (report) => {
    let divTuitionFeeResult = document.getElementById("tuition_fee_result");
    let divAnnualFeeResult = document.getElementById("annual_fee_result");
    divTuitionFeeResult.style.display = "block";
    divAnnualFeeResult.style.display = "none";
    renderWrongAmountMembers(divTuitionFeeResult.querySelector(".wrongAmountMembers"), document.getElementById("wrongAmountMembersStat"), report.wrongAmountMembers);
    renderUnpaidMembers(divTuitionFeeResult.querySelector(".unpaidMembers"), document.getElementById("unpaidMembersStat"), report.unpaidMembers);
    renderAbsentMembers(divTuitionFeeResult.querySelector(".absentMembers"), document.getElementById("absentMembersStat"), report.absentMembers);
    renderPaidMembers(divTuitionFeeResult.querySelector(".paidMembers"), document.getElementById("paidMembersStat"), report.paidMembers);
    renderInvalidMembers(divTuitionFeeResult.querySelector(".invalidMembers"), document.getElementById("invalidMembersStat"), report.invalidMembers);
};
const renderDataProperties = (numMembers, numTransactions, oldestTransaction, newestTransaction) => {
    const divProperties = document.getElementById("properties");
    divProperties.style.display = null;
    let tableDataProperties = divProperties.querySelector(".dataProperties");
    tableDataProperties.innerHTML = "";
    let tableRow = document.createElement("tr");
    let tableDataNumMembers = document.createElement("td");
    tableDataNumMembers.append(numMembers.toString());
    tableRow.append(tableDataNumMembers);
    let tableDataNumTransactions = document.createElement("td");
    tableDataNumTransactions.append(numTransactions.toString());
    tableRow.append(tableDataNumTransactions);
    let tableDataOldestTransaction = document.createElement("td");
    tableDataOldestTransaction.append(oldestTransaction.date.toISOString().split('T')[0]);
    tableRow.append(tableDataOldestTransaction);
    let tableDataNewestTransaction = document.createElement("td");
    tableDataNewestTransaction.append(newestTransaction.date.toISOString().split('T')[0]);
    tableRow.append(tableDataNewestTransaction);
    tableDataProperties.append(tableRow);
};
const executeTuitionCalculation = () => {
    let absentMembers = Array();
    let unpaidMembers = Array();
    let invalidMembers = Array();
    let wrongAmountMembers = Array();
    let paidMembers = Array();
    memberManager.members.forEach((member) => {
        const name = member.name;
        const partnerName = member.partner.name;
        if (member.childrenState.numChildren === member.childrenState.numAbsentChildren && member.childrenState.numChildren !== 0) {
            absentMembers.push(member);
            return;
        }
        const nameMatchedTransactions = transactionManager.transactions.filter((transaction) => {
            const payer = transaction.payer.toUpperCase();
            const purpose = transaction.purpose.toUpperCase();
            if (payer.includes(name.firstName.toUpperCase()) && payer.includes(name.lastName.toUpperCase()))
                return true;
            else if (payer.includes(partnerName.firstName.toUpperCase()) && payer.includes(partnerName.lastName.toUpperCase()))
                return true;
            else if (purpose.includes(name.firstName.toUpperCase()) && purpose.includes(name.lastName.toUpperCase()))
                return true;
            else if (purpose.includes(partnerName.firstName.toUpperCase()) && purpose.includes(partnerName.lastName.toUpperCase()))
                return true;
            return false;
        });
        if (nameMatchedTransactions.length === 0) {
            unpaidMembers.push(member);
            return;
        }
        const correctAmountTransaction = nameMatchedTransactions.find((transaction) => {
            return member.childrenState.getQuarterlyTuition() === transaction.amount;
        });
        if (correctAmountTransaction === undefined)
            wrongAmountMembers.push(new MatchedRecord(member, nameMatchedTransactions));
        else
            paidMembers.push(new MatchedRecord(member, [correctAmountTransaction]));
    });
    renderDataProperties(memberManager.members.length, transactionManager.transactions.length, transactionManager.getOldestTransaction(), transactionManager.getNewestTransaction());
    renderResult(new Report(unpaidMembers, wrongAmountMembers, invalidMembers, absentMembers, paidMembers));
};
const executeAnnualFeeCalculation = () => {
};
window.onload = () => {
    const memberListInput = document.getElementById("member_list_input");
    const bankTransactionsInput = document.getElementById("bank_transactions_input");
    memberListInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            memberManager = new MemberManager(event.target.result.toString());
        };
        reader.readAsText(file);
    };
    bankTransactionsInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            transactionManager = new TransactionManager(event.target.result.toString());
        };
        reader.readAsText(file);
    };
    const tuitionCheckButton = document.getElementById("tuitionCheckButton");
    tuitionCheckButton.onclick = executeTuitionCalculation;
    const annualFeeButton = document.getElementById("annualFeeButton");
    annualFeeButton.onclick = executeAnnualFeeCalculation;
};
//# sourceMappingURL=main.js.map