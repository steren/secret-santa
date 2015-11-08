/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem('Organize event', 'showSidebar') // this string cannot be translated using our locale file...
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

var titleRow = {
  "names": "Names",
  "mails": "E-mails",
  "group": "Group (optional)",
  "targets_names": "target names",
  "targets_numbers": "target numbers"
}
var groupTitleNote = 'Participants with the same group name will not offer presents to each other.';

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Secret Santa');
  SpreadsheetApp.getUi().showSidebar(ui);

  // check that current sheet can be used:
  var titleValues = SpreadsheetApp.getActive().getRange('A1:B1').getValues();
  if(titleValues[0][0] != titleRow.names && titleValues[0][1] != titleRow.mails) {
    createSheet();
  }
}

/**
 * Create a new Sheet with the columns needed for our Secret Santa script.
 */
function createSheet() {
  // see https://developers.google.com/apps-script/reference/spreadsheet/sheet
  var sheet = SpreadsheetApp.getActive();
  // make sure 'Secret Santa' is not already taken
  var secretSantaSheet = sheet.getSheetByName('Secret Santa');
  if(secretSantaSheet) {
    secretSantaSheet.setName('Secret Santa (archived)');
  }
  sheet.insertSheet('Secret Santa', 0);
  sheet.appendRow([titleRow.names, titleRow.mails, titleRow.group, titleRow.targets_names, titleRow.targets_numbers]);
  sheet.hideColumn(sheet.getRange('D:E'));
  sheet.getRange('A1:C1').setFontWeight('bold');
  sheet.getRange('A:C').setBorder(true, true, true, true, true, true);
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 120);
  sheet.getRange('C1').setNote(groupTitleNote);

  var rule = SpreadsheetApp.newDataValidation().requireTextIsEmail().setHelpText('Enter a valid e-mail address.');
  sheet.getRange('B2:B').setDataValidation(rule);
}
