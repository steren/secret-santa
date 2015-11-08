var validateAssignation = function(members, numberOfPresents) {
  'use strict';

  for( var m = 0; m < members.length; m++) {
    var member = members[m];

    // I have to offer to the exact number of persons
    if(member.targets.length !== numberOfPresents) { return {error: true, errid: 'present', msg: 'One of the member has not enough present'}; }

    // I should not offer something to myself
    if(_.contains(member.targets, m)) {return {error: true, errid: 'own', msg: 'One of the member was supposed to offer himself a present'}; }

    // I should not ofer something to someone from my group
    if(member.group) {
      for(var t = 0; t < member.targets.length; t++) {
        if( members[member.targets[t]].group === member.group) {
          return {error: true, errid: 'group', msg: 'One of the member was supposed to offer a present to someone in his group'};
        }
      }
    }
  }

  for( var p = 0; p < numberOfPresents; p++) {
    var targets = _.map(members, function(member){ return member.targets[p]; });

    // everyone should receive this present
    var diff = _.difference(_.range(members.length), targets);
    if(diff.length > 0) {return {error: true, errid: 'missed', msg: 'Someone is not going to receive something'}; }

    // no double
    if(_.uniq(targets).length !== members.length) {return {error: true, errid: 'double', msg: 'Someone was not going to to much presents'}; }
  }

  return {error: false};
};

/**
 * @param Array members
 */
var assignTargetsIterating = function(members, numberOfPresents) {
  'use strict';

  for(var currentPresent = 0; currentPresent < numberOfPresents; currentPresent++) {

    var randomTargets = _.shuffle( _.range(members.length) );

    for( var m = 0; m < members.length; m++) {
      var member = members[m];
      var t = 0;
      // iterate until we find a target that is not the member, not already a target of the member, and not on the member's group
      while(t < randomTargets.length && (randomTargets[t] === m || _.contains(member.targets, randomTargets[t]) || (member.group && member.group === members[randomTargets[t]].group) )) {
        t++;
      }
      // check if solution has been found
      if(t === randomTargets.length) {
        // return error
        return { error: true, errid: 'target', msg: 'Could not assign present'};
      }
      // add this guy to this member's target
      member.targets.push(randomTargets[t]);
      // remove this guy from the available targets
      randomTargets = _.without(randomTargets, randomTargets[t]);

    }
  }

  return {error: false, members : members};
};

var assignTargetsAndValidate = function(members, numberOfPresents, fAssign) {
  'use strict';

  var result = fAssign(members, numberOfPresents);
  if(result.error) {return result}

  // check result
  var validation = validateAssignation(members, numberOfPresents);
  if(validation.error) {
    return validation;
  } else {
    return result;
  }

};

var assignTargetsAndValidateUntilValid = function(members, numberOfPresents, fAssign) {
  // loop and break at the first success
  for(var loop = 0; loop < 100; loop++) {
    var result = assignTargetsAndValidate(members, numberOfPresents, fAssign);
    if(!result.error) {
      return result;
    }
  };
  return {error: true};
};
