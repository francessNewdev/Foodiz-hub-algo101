import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

export class Order {
  constructor(mealId, count) {
    this.mealId = mealId;
    this.count = count;
  }
}

const config = {
  algodToken: "",
  algodServer: "https://node.testnet.algoexplorerapi.io",
  algodPort: "",
  indexerToken: "",
  indexerServer: "https://algoindexer.testnet.algoexplorerapi.io",
  indexerPort: "",
};

export const algodClient = new algosdk.Algodv2(
  config.algodToken,
  config.algodServer,
  config.algodPort
);

export const indexerClient = new algosdk.Indexer(
  config.indexerToken,
  config.indexerServer,
  config.indexerPort
);

export const myAlgoConnect = new MyAlgoConnect();

export const minRound = 21540981;

// https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0002.md
export const mealNote = "foodiz:uv1";
export const orderNote = "foodiz-order:uv1";

export const foodizPaymentAddr =
  "GROKXQMELYOO5WDE6U5OP2TRKF3ZCSIBCV47KBEJWMMNPUDXLQGS7SXQSM";

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalIntsMeal = 1; // Global variables stored as Int: price
export const numGlobalBytesMeal = 2; // Global variables stored as Bytes: name, image
// Maximum global storage allocation, immutable
export const numGlobalIntsOrder = 11; // Global variables stored as Int: counts, date, total
export const numGlobalBytesOrder = 0; // Global variables stored as Bytes: name, description, image

export const ALGORAND_DECIMALS = 6;
