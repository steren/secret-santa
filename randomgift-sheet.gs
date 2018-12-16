//////////////////////////////////////
// EN locale
//////////////////////////////////////
var msgLocales = {
  "en": {
    "ui" : {
      "sent_title": "Success: All emails sent",
      "sent": "Congratulation, the distribution has been successful and all e-mails have been sent. Enjoy your Event!",
      "error": "Sorry, something went wrong."
    },
    "mail" : {
      "dear": "Dear",
      "participants": "The people participating are",
      "signature": "Enjoy!",
      "target": "is your target for this event.",
      "target_multiple": "are your targets for this event.",
      "explanations": "You were assigned this person for the blind gift distribution and you are the only one to know it. Your mission is now to find a gift for that person. Don't worry, another participant will take care of yours.",
      "explanations_multiple": "You were assigned these people for the blind gift distribution and you are the only one to know it. Your mission is now to find gifts for them. Don't worry, other participants will take care of yours.",
      "title": "your target for this event is...",
      "title_multiple": "your targets for this event are..."
    },
    "errors" :{
      "empty": "Your list is empty. Please add at least two participants to your event.",
      "one": "There is only one participant in the list. It's a little bit sad. Please add at least one more.",
      "member_not_valid": "There is an issue with the participant list.\nPlease correct name and email of the person at line number ",
      "assign_failed": "Our system cannot find an assignation of presents that fulfills the selected number of presents and your groups.\n\nPlease, double check that the number of presents you entered is correctly the number of presents each member has to offer (very often 1 or 2). Also, make sure there is not a group that is too big, remember that people in the same group will not offer presents to each others."
    }
  },
  "fr": {
    "ui" : {
      "sent_title": "OK, tous les emails ont été envoyés.",
      "sent": "Félicitations, la distribution est un succès et tous les emails ont bien été envoyés. Bonnes fêtes !",
      "error": "Désolé, quelque chose ne s'est pas bien passé."
    },
    "mail" : {
      "dear": "Chère ou Cher",
      "participants": "Les participants sont",
      "signature": "Bonnes fêtes !",
      "target": "est votre cible pour cet évènement.",
      "target_multiple": "ont vos cibles pour cet évènement.",
      "explanations": "Vous avez été assigné cette personne pour la distribution de cadeaux et vous seul avez cette information. Votre mission est maintenant de trouver un cadeau pour cette personne. Ne vous inquiétez pas, un autre participant s'occupe du vôtre.",
      "explanations_multiple": "Vous avez été assigné ces personnes pour la distribution de cadeaux et vous seul avez cette information. Votre mission est maintenant de trouver des cadeau pour cette personne. Ne vous inquiétez pas, un autre participant s'occupe des vôtres.",
      "title": "votre cible pour cet évènement est...",
      "title_multiple": "vos cibles pour cet évènement sont..."
    },
    "errors" :{
      "empty": "Votre liste est vide. Ajoutez au moins deux participants à votre évènement.",
      "one": "Il n'y a qu'un participant dans la liste. C'est un peu triste. Ajoutez en au moins un autre.",
      "member_not_valid": "Il y a un problème avec la liste des participants.\nCorrigez le nom et email de la personne à la ligne ",
      "assign_failed": "Notre système ne peut pas trouver de solution pour les cadeaux qui satisfasse les critères de groupes et de nombre de cadeaux.\n\nVérifiez que le nombre de cadeaux que vous avez entré correspond au nombre de cadeaux que chaque membre doit offrir (très souvent 1 ou 2). Aussi, vérifiez qu'il n'y a pas un groupe trop gros, rappelez vous que les personnes du même groupe ne s'offriront pas de cadeaux entre eux."
    }
  },
  "es": {
    "ui" : {
      "sent_title": "Exito: Todos los correos enviados",
      "sent": "Felicidades, se ha completado la distribución y todos los correos han sido enviados. Disfruta tu evento!",
      "error": "Lo siento, algo salió mal."
    },
    "mail" : {
      "dear": "Estimad@",
      "participants": "Los participantes son",
      "signature": "Disfruta!",
      "target": "es tu amig@ secret@ en este evento.",
      "target_multiple": "are your targets for this event.",
      "explanations": "Te hemos asignado esta persona para la entrega ciega de regalos, solamente tu sabes esto. Tu misión ahora es encontrar un regalo para esta persona. No te preocupes, otra persona se hará cargo de tu regalo.",
      "explanations_multiple": "Te hemos asignado estas personas para la entrega ciega de regalo y solo tu sabes esto. Tu misión es encontrar regalos para ellos. No te preocupes, otros participantes se harán cargo de tu regalo.",
      "title": "tu amig@ secret@ para este evento es...",
      "title_multiple": "tus amig@s secret@s para este evento son..."
    },
    "errors" :{
      "empty": "Tu lista esta vacia. Por favor agrega por lo menos dos participantes para tu evento.",
      "one": "Solo hay un participante en la lista. Esto es un poco triste. Por favor agrega al menos uno más.",
      "member_not_valid": "Hay un problema con la lista de participantes.\nPor favor corrige el nomnbre y correo de la persona en la linea ",
      "assign_failed": "Nuestro sistema no puede asignar los regalos de forma que se cumplan las condiciones de cantidad de regalos y grupos definidos.\n\nPor favor, revisa que el número de regalos ingresados es correcto y corresponde con el numero de regalos que cada miembro puede ofrecer (normalmente 1 o 2). Tambien, asegurate de que no hay un grupo muy grande, recuerda que las personas del mismo grupo no se regalaran entre ellos."
    }
  }
};

var msgLocale;

// select different locale if available
var locale = Session.getActiveUserLocale();
if(msgLocales[locale]) {
  msgLocale = msgLocales[locale];
} else {
  msgLocale = msgLocales.en;
}

var msgUI = msgLocale.ui;
var msgErrors = msgLocale.errors;
var msgMail = msgLocale.mail;

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
      bodyString += msgMail.dear + ' ' + members[m].name + ',\n';
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
