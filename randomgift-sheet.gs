// EN locale
//////////////////////////////////////
var msgUIEN = {
  "sent_title": "Success: All emails sent",
  "sent": "Congratulation, the distribution has been successful and all e-mails have been sent. Enjoy your Event!",
  "error": "Sorry, something went wrong."
}

var msgMailEN = {
  "dear": "Dear",
  "participants": "The people participating are",
  "signature": "Enjoy!",
  "target": "is your target for this event.",
  "target_multiple": "are your targets for this event.",
  "explanations": "You were assigned this person for the blind gift distribution and you are the only one to know it. Your mission is now to find a gift for that person. Don't worry, another participant will take care of yours.",
  "explanations_multiple": "You were assigned these people for the blind gift distribution and you are the only one to know it. Your mission is now to find gifts for them. Don't worry, other participants will take care of yours.",
  "title": "your target for this event is...",
  "title_multiple": "your targets for this event are..."
}
var msgErrorsEN = {
  "empty": "Your list is empty. Please add at least two participants to your event.",
  "one": "There is only one participant in the list. It's a little bit sad. Please add at least one more.",
  "member_not_valid": "There is an issue with the participant list.\nPlease correct name and email of the person at line number ",
  "assign_failed": "Our system cannot find an assignation of presents that fulfills the selected number of presents and your groups.\n\nPlease, double check that the number of presents you entered is correctly the number of presents each member has to offer (very often 1 or 2). Also, make sure there is not a group that is too big, remember that people in the same group will not offer presents to each others."
}

// FR locale
//////////////////////////////////////
var msgMailFR = {
}

// select locale
var msgUI = msgUIEN;
var msgErrors = msgErrorsEN;

var msgMail = msgMailEN;


function assignFromSheetAndSendMails(numberOfPresents, eventName, eventMessage) {
  try {
    assignFromSheet(numberOfPresents);

    //var choice =  ui.alert(msgUI.drawing_done_title, msgUI.drawing_done, ui.ButtonSet.OK_CANCEL);

    sendMails(eventName, eventMessage);
    var ui = SpreadsheetApp.getUi();
    ui.alert(msgUI.sent_title, msgUI.sent, ui.ButtonSet.OK);

  } catch (msg) {
    showError(msg);
    return;
  }
}

/**
 * Retrieves all the rows in the active spreadsheet that contain data and logs the
 * values for each row.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function assignFromSheet(numberOfPresents) {
  var sheet = SpreadsheetApp.getActiveSheet();
  // Target cells
  var targetRows = sheet.getRange("D:E");
  var targetValues = targetRows.getValues();

  // Extract members from sheet
  var members = [];
  members = extractMembers(sheet);

  //Logger.log(members);

  var result = assignTargetsAndValidateUntilValid(members, numberOfPresents, assignTargetsIterating);
  //Logger.log(result);

  // Write back results in hidden column
  if(!result.error) {
    for( var m = 0; m < result.members.length; m++) {
      var targetNameString = '';
      var targetNumberString = '';
      for(var t = 0; t < result.members[m].targets.length; t++) {
        targetNameString += result.members[result.members[m].targets[t]].name;
        targetNameString += ', ';
        targetNumberString += result.members[m].targets[t];
        targetNumberString += ',';
      }

      targetValues[m+1][0] = targetNameString;
      targetValues[m+1][1] = targetNumberString;
    }
  } else {
    throw msgErrors['assign_failed'];
  }

  targetRows.setValues(targetValues);
};

function extractMembers(sheet, sheetNumRows) {
  var sheetNumRows = sheet.getLastRow();
  if(sheetNumRows < 2) {
    throw msgErrors.empty;
  } else if (sheetNumRows < 3) {
    throw msgErrors.one;
  }

  var members = [];
  var rows = sheet.getRange(2,1, sheetNumRows - 1, 3);
  var values = rows.getValues();

  var member;
  for (var i = 0; i < sheetNumRows - 1; i++) {
    if( values[i][0] && values[i][1]) {
      member = {
        name: values[i][0],
        email: values[i][1],
        targets : []
      };

      if(values[i][2]) {
        member.group = values[i][2];
      }

      members.push(member);
    } else {
      throw msgErrors.member_not_valid + (i+2) + '.';
    }
  }
  //Logger.log(members);
  return members;
}

function sendMails(eventName, eventMessage) {
  var ui = SpreadsheetApp.getUi();

  var sheet = SpreadsheetApp.getActiveSheet();
  var sheetNumRows = sheet.getLastRow();

  var targetRows = sheet.getRange("E:E");
  var targetValues = targetRows.getValues();

  var members = extractMembers(sheet);

  //Logger.log(eventName);
  //Logger.log(eventMessage);

  var memberString = '';
  for (var m = 0; m < members.length; m++) {
    memberString += members[m].name;
    memberString += getListSeparator(m, members.length);
  }

  for (var m = 0; m < members.length; m++) {
    if( targetValues[m + 1][0] ) {
      var targetNumbers = targetValues[m + 1][0].split(',');

      var multiple = false;
      if(targetNumbers.length - 1 > 1) {
        multiple = true;
      }

      var bodyString = '';
      bodyString += msgMailEN.dear + ' ' + members[m].name + ',\n';
      bodyString += '\n';
      if(eventMessage) {
        bodyString += eventMessage + '\n';
        bodyString += '\n';
      }

      for (var t = 0; t < targetNumbers.length - 1; t++) {
        var tn = parseInt(targetNumbers[t], 10);
        bodyString += members[tn].name;
        bodyString += getListSeparator(t, targetNumbers.length - 1);
      }
      if(multiple) {
        bodyString += ' ' + msgMail.target_multiple + '\n';
      } else {
        bodyString += ' ' + msgMail.target + '\n';
      }

      bodyString += '\n';
      bodyString += msgMail.participants + ' ' + memberString + '.' + '\n';

      if(multiple) {
        bodyString += msgMail.explanations_multiple + '\n';
      } else {
        bodyString += msgMail.explanations + '\n';
      }


      bodyString += '\n';
      bodyString += msgMail.signature;

      var title = eventName + ': ' + members[m].name + ', ';
      if(multiple) {
        title += msgMail.title_multiple;
      } else {
        title += msgMail.title;
      }
      MailApp.sendEmail(members[m].email, title, bodyString);
    }
  }
}

/** return ',' 'and' or nothing depending on the total number and index */
function getListSeparator(index, total) {
  if( index + 1 < total) {
    if(index + 1 == total - 1) {
      return ' and ';
    }
    return ', ';
  }
  return '';
}

function showError(msg) {
  var ui = SpreadsheetApp.getUi();
  ui.alert(msgUI.error, msg, ui.ButtonSet.OK);
}
