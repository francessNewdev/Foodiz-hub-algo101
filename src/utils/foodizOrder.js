import algosdk from "algosdk";

import {
  algodClient,
  indexerClient,
  orderNote,
  minRound,
  myAlgoConnect,
  numGlobalBytesOrder,
  numGlobalIntsOrder,
  numLocalBytes,
  numLocalInts,
  foodizPaymentAddr,
} from "./constants";
/* eslint import/no-webpack-loader-syntax: off */
import approvalProgram from "!!raw-loader!../contracts/order_approval.teal";
import clearProgram from "!!raw-loader!../contracts/order_clear.teal";
import { base64ToUTF8String, utf8ToBase64String } from "./conversions";

class OrderInfo {
  constructor(appId, date, details, total) {
    this.appId = appId;
    this.date = date;
    this.details = details;
    this.total = total;
  }
}

// Compile smart contract in .teal format to program
const compileProgram = async (programSource) => {
  let encoder = new TextEncoder();
  let programBytes = encoder.encode(programSource);
  let compileResponse = await algodClient.compile(programBytes).do();
  return new Uint8Array(Buffer.from(compileResponse.result, "base64"));
};

// CREATE order: ApplicationCreateTxn
export const createOrderAction = async (senderAddress, orders, total) => {
  console.log("Adding order...");

  if (orders.length > 10) {
    throw new Error("Too much orders");
  }

  let params = await algodClient.getTransactionParams().do();

  // Compile programs
  const compiledApprovalProgram = await compileProgram(approvalProgram);
  const compiledClearProgram = await compileProgram(clearProgram);

  // Build note to identify transaction later and required app args as Uint8Arrays
  let note = new TextEncoder().encode(orderNote);
  let appArgs = [];
  let foreignApps = [];

  for (let order of orders) {
    appArgs.push(algosdk.encodeUint64(Number(order.count)));
    foreignApps.push(order.mealId);
  }

  // Create ApplicationCreateTxn
  let orderCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    approvalProgram: compiledApprovalProgram,
    clearProgram: compiledClearProgram,
    numLocalInts: numLocalInts,
    numLocalByteSlices: numLocalBytes,
    numGlobalInts: numGlobalIntsOrder,
    numGlobalByteSlices: numGlobalBytesOrder,
    note: note,
    appArgs: appArgs,
    foreignApps: foreignApps,
  });

  // Create PaymentTxn
  let paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: foodizPaymentAddr,
    amount: total,
    suggestedParams: params,
  });

  let txnArray = [orderCreateTxn, paymentTxn];

  // Create group transaction out of previously build transactions
  let groupID = algosdk.computeGroupID(txnArray);
  for (let i = 0; i < 2; i++) txnArray[i].group = groupID;

  // Sign & submit the group transaction
  let signedTxn = await myAlgoConnect.signTransaction(
    txnArray.map((txn) => txn.toByte())
  );
  console.log("Signed group transaction");
  let tx = await algodClient
    .sendRawTransaction(signedTxn.map((txn) => txn.blob))
    .do();

  // Wait for group transaction to be confirmed
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  // Notify about completion
  console.log(
    "Group transaction " +
      tx.txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );
};

// DELETE order: ApplicationDeleteTxn
export const deleteOrderAction = async (senderAddress, index) => {
  console.log("Deleting application...");

  let params = await algodClient.getTransactionParams().do();

  // Create ApplicationDeleteTxn
  let txn = algosdk.makeApplicationDeleteTxnFromObject({
    from: senderAddress,
    suggestedParams: params,
    appIndex: index,
  });

  // Get transaction ID
  let txId = txn.txID().toString();

  // Sign & submit the transaction
  let signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
  console.log("Signed transaction with txID: %s", txId);
  await algodClient.sendRawTransaction(signedTxn.blob).do();

  // Wait for transaction to be confirmed
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  // Get the completed Transaction
  console.log(
    "Transaction " +
      txId +
      " confirmed in round " +
      confirmedTxn["confirmed-round"]
  );

  // Get application id of deleted application and notify about completion
  let transactionResponse = await algodClient
    .pendingTransactionInformation(txId)
    .do();
  let appId = transactionResponse["txn"]["txn"].apid;
  console.log("Deleted app-id: ", appId);
};

// GET orderS: Use indexer
export const getOrdersAction = async (senderAddress) => {
  console.log("Fetching orders...");

  let note = new TextEncoder().encode(orderNote);
  let encodedNote = Buffer.from(note).toString("base64");

  // Step 1: Get all transactions by notePrefix (+ minRound filter for performance)
  let transactionInfo = await indexerClient
    .searchForTransactions()
    .notePrefix(encodedNote)
    .txType("appl")
    .minRound(minRound)
    .address(senderAddress)
    .do();

  let orders = [];
  for (const transaction of transactionInfo.transactions) {
    let appId = transaction["created-application-index"];
    if (appId) {
      // Step 2: Get each application by application id
      let order = await getApplication(appId);
      if (order) {
        orders.push(order);
      }
    }
  }
  console.log("orders fetched.");
  return orders;
};

const getApplication = async (appId) => {
  try {
    // 1. Get application by appId
    let response = await indexerClient
      .lookupApplications(appId)
      .includeAll(true)
      .do();
    if (response.application.deleted) {
      return null;
    }
    let globalState = response.application.params["global-state"];
    let date = 0;
    let total = 0;
    let details = [];

    const getField = (fieldName, globalState) => {
      return globalState.find((state) => {
        return state.key === utf8ToBase64String(fieldName);
      });
    };

    if (getField("TOTAL", globalState) !== undefined) {
      total = getField("TOTAL", globalState).value.uint;
    }

    if (getField("TIME", globalState) !== undefined) {
      date = getField("TIME", globalState).value.uint;
    }

    for (let state of globalState) {
      if (
        state.key === utf8ToBase64String("TIME") ||
        state.key === utf8ToBase64String("TOTAL")
      )
        continue;

      let mealCount = {
        name: base64ToUTF8String(state.key),
        count: state.value.uint,
      };

      details.push(mealCount);
    }

    return new OrderInfo(appId, date, details, total);
  } catch (err) {
    return null;
  }
};
