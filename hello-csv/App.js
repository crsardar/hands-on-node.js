#!/usr/bin/env node
var csv = require("csv-parser");
var fs = require("fs");
var Client = require("node-rest-client").Client;

const PROCESSING_CSV_FILE = "./small.csv";

const summery = {};

var functionToCall = 0;
var targetToken = null;
var targetDate = null;

const BASE_URI = "https://min-api.cryptocompare.com/data/pricemulti";
const QUERY_PARAM = "fsyms=SGD&tsyms=USD";
const API_KEY =
  "9ef97e760722851b05c0db5e75cd4f8c65bba37279c6acaded234a944eee075c";
const FULL_URI = BASE_URI + "?" + QUERY_PARAM + "&api_key=" + API_KEY;

// Check command line arguments
if (process.argv.length == 3) {
  var arg1 = process.argv[2];
  if (isNaN(arg1)) {
    functionToCall = 1;
    targetToken = arg1;
  } else {
    functionToCall = 2;
    targetDate = arg1;
  }
} else if (process.argv.length == 4) {
  var arg1 = process.argv[2];
  var arg2 = process.argv[3];
  if (!isNaN(arg1) && isNaN(arg2)) {
    functionToCall = 3;
    targetDate = arg1;
    targetToken = arg2;
  } else if (isNaN(arg1) && !isNaN(arg2)) {
    functionToCall = 3;
    targetToken = arg1;
    targetDate = arg2;
  }
}

fs.createReadStream(PROCESSING_CSV_FILE)
  .pipe(csv())
  .on("data", function (row) {
    switch (functionToCall) {
      case 0:
        summeryAll(row);
        break;
      case 1:
        summeryOnToken(targetToken, row);
        break;
      case 2:
        summeryOnDate(targetDate, row);
        break;
      case 3:
        summeryOnTokenAndDate(targetToken, targetDate, row);
        break;
      default:
        break;
    }

    //console.log(row);
  })
  .on("end", function () {
    convertToUSD(summery);
  });

function summeryAll(row) {
  if (row.transaction_type == "DEPOSIT") {
    if (row[row.token] === undefined) {
      summery[row.token] = row.amount;
    } else {
      summery[row.token] = summery[row.token] + row.amount;
    }
  } else if (row.transaction_type == "WITHDRAWAL") {
    if (row[row.token] === undefined) {
      summery[row.token] = -row.amount;
    } else {
      summery[row.token] = summery[row.token] - row.amount;
    }
  } else {
    console.log(
      "==========> Invalid transaction type : " + row.transaction_type
    );
  }
}

function summeryOnToken(targetToken, row) {
  if (targetToken != row.token) {
    return;
  }

  if (row.transaction_type == "DEPOSIT") {
    if (row[row.token] === undefined) {
      summery[row.token] = row.amount;
    } else {
      summery[row.token] = summery[row.token] + row.amount;
    }
  } else if (row.transaction_type == "WITHDRAWAL") {
    if (row[row.token] === undefined) {
      summery[row.token] = -row.amount;
    } else {
      summery[row.token] = summery[row.token] - row.amount;
    }
  } else {
    console.log(
      "==========> Invalid transaction type : " + row.transaction_type
    );
  }
}

function summeryOnDate(targetDate, row) {
  if (row.timestamp == null || row.timestamp === undefined) {
    return;
  }

  var date1 = isNaN(targetDate)
    ? new Date(parseInt(targetDate))
    : new Date(targetDate);
  var date2 = isNaN(row.timestamp)
    ? new Date(parseInt(row.timestamp))
    : new Date(row.timestamp);

  if (date1.toDateString() === date2.toDateString()) {
    if (row.transaction_type == "DEPOSIT") {
      if (row[row.token] === undefined) {
        summery[row.token] = row.amount;
      } else {
        summery[row.token] = summery[row.token] + row.amount;
      }
    } else if (row.transaction_type == "WITHDRAWAL") {
      if (row[row.token] === undefined) {
        summery[row.token] = -row.amount;
      } else {
        summery[row.token] = summery[row.token] - row.amount;
      }
    } else {
      console.log(
        "==========> Invalid transaction type : " + row.transaction_type
      );
    }
  }
}

function summeryOnTokenAndDate(targetToken, targetDate, row) {
  if (
    row.timestamp == null ||
    row.timestamp === undefined ||
    targetToken != row.token
  ) {
    return;
  }

  var date1 = isNaN(targetDate)
    ? new Date(parseInt(targetDate))
    : new Date(targetDate);
  var date2 = isNaN(row.timestamp)
    ? new Date(parseInt(row.timestamp))
    : new Date(row.timestamp);

  if (date1.toDateString() === date2.toDateString()) {
    if (row.transaction_type == "DEPOSIT") {
      if (row[row.token] === undefined) {
        summery[row.token] = row.amount;
      } else {
        summery[row.token] = summery[row.token] + row.amount;
      }
    } else if (row.transaction_type == "WITHDRAWAL") {
      if (row[row.token] === undefined) {
        summery[row.token] = -row.amount;
      } else {
        summery[row.token] = summery[row.token] - row.amount;
      }
    } else {
      console.log(
        "==========> Invalid transaction type : " + row.transaction_type
      );
    }
  }
}

function convertToUSD(summery) {
  if (summery == null) {
    console.log("NO Summery Available.");
    return;
  }

  var client = new Client();

  client.get(FULL_URI, (data) => {
    let usdRate = data.SGD.USD;

    console.log("USD exchange rate = " + usdRate);

    Object.keys(summery).forEach((key) => {
      summery[key] = summery[key] * usdRate;
    });

    console.log("\n\nPortfolio value = " + JSON.stringify(summery) + "\n\n");
  });
}
