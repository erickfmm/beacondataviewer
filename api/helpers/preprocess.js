module.exports = {


  friendlyName: 'Preprocess',


  description: 'Preprocess something.',


  inputs: {
    jsonContents: {
      type: 'ref',
      description: 'The contents',
      required: true
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var items = [];
    var scenes = [];
    for (const el of inputs.jsonContents) {
        if(scenes.indexOf(el["scene"]) == -1){
        scenes.push(el["scene"]);
        }
        items.push(el);
    }

    for (const i in items) {
        var timEvD = new Date(items[i]["timeEv"]);
        items[i]["timeEv"] = (timEvD.getUTCMilliseconds() * 1000.0) + (timEvD.getUTCSeconds()) + (timEvD.getUTCMinutes() / 60.0);
        var timeInter = new Date(items[i]["timeInterval"]);
        items[i]["timeInterval"] = timeInter.getUTCMilliseconds() * 1000.0 + timeInter.getUTCSeconds() + timeInter.getUTCMinutes() / 60.0;
    }

    // All done.
    return exits.success([items, scenes]);

  }


};

