function testOneAssign(numberOfMembers, numberOfPresents, groups, fAssign, callback )  {
  'use strict';

  var numberInCurrentGroup = 0;
  var group = 0;
  var inGroup = false;
  if(groups.length > 0) {
    inGroup = true;
  }

  // create a fake member array
  var members = [];
  for(var i = 0; i < numberOfMembers; i++) {


    var member = {
      name: 'Member ' + i,
      email: 'm' + i + '@members.com',
      targets : []
    };
    if(inGroup) {
      member.group = 'group ' + group;
    }

    members.push(member);

    numberInCurrentGroup++;
    if(groups.length && numberInCurrentGroup == groups[group]) {
      numberInCurrentGroup = 0;
      group++;
      if(group >= groups.length) {
        inGroup = false;
      }
    }
  }

  // shuffle members for more realistic data
  members = _.shuffle( members );

  return assignTargetsAndValidate(members, numberOfPresents, fAssign);

};

function testAssign(numberOfMembers, numberOfPresents, groups, fAssign, numberOfTests) {
  'use strict';

  var numberFail = 0;
  var numberTest = 0;
  for( var i = 0; i < numberOfTests; i++) {
    var result = testOneAssign(numberOfMembers, numberOfPresents, groups, fAssign);
    if(result.error) {
      numberFail++;
    }
    numberTest++;

    if(numberTest === numberOfTests) {
      var warning = '';
      if(numberFail === numberOfTests) {warning = ' ------- FAIL';}
      Logger.log('Test (/'+numberTest+') : ' + numberOfPresents + 'p / ' + numberOfMembers + 'm / '+ groups.length+ 'g - failed: ' + numberFail + warning);
    }
  }
};

function testAssignRand(fAssign, numberOfTests, bGroups) {
  'use strict';

  var memberNumber = _.random(2, 100);
  var presentNumber = _.random(1, Math.min(3, memberNumber - 1));

  var groups = [];
  if(bGroups) {
    var groupSize = _.random(1, memberNumber/4 );
    if(groupSize > 1) {
      var groupNumber = _.random(memberNumber / groupSize);
      // initialize the array
      while(groupNumber-- > 0) {groups.push(groupSize);}
    }
  }

  testAssign(memberNumber, presentNumber, groups, fAssign, numberOfTests);

};

function testValidate() {
  'use strict';

  var fail1 = [
    {targets: [1], name: 'Steren', group:'paninis', },
    {targets: [2], name: 'Anne', group:'paninis'},
    {targets: [0], name: 'Xavier'}
  ];

  if(validateAssignation(fail1).error !== true) {Logger.log('test1 ---------- FAIL');} else { Logger.log('test1 OK'); }
};

function testRunner() {
  'use strict';

  var numberOfFulltests = 1;
  var numberOfTests = 5;

  testValidate();



  for(var i = 0; i < numberOfFulltests; i++) {
    testAssignRand(assignTargetsIterating, numberOfTests, false);
  }

  for(var i = 0; i < numberOfFulltests; i++) {
    testAssignRand(assignTargetsIterating, numberOfTests, true);
  }

};
