#!/usr/bin/env node
var csv = require("csv-parser");
var fs = require("fs");

const fileToProcess = "./small.csv";

const summery = {};

var functionToCall = 0;
var targetToken = null;
var targetDate = null;

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

fs.createReadStream(fileToProcess)
  .pipe(csv())
  .on("data", function (row) {
    /*
    console.log("functionToCall = " + functionToCall);
    console.log("targetToken = " + targetToken);
    console.log("targetDate = " + targetDate);
    */

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

    console.log(row);
  })
  .on("end", function () {
    console.log("Summery = " + JSON.stringify(summery));
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
