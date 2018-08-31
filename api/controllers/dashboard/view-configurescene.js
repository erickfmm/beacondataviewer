module.exports = {


  friendlyName: 'View configurescene',


  description: 'Display "Configurescene" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/configurescene'
    }

  },


  fn: async function (inputs, exits) {
    var fs = require("fs");
    var contents = fs.readFileSync("sample-data/sample-data2-realesexpkarla-malos.json");
    var jsonContents = JSON.parse(contents);

    var longsIds = {};
    var allScenes = {};
    for(const i in jsonContents){
      if(!(jsonContents[i]["scene"] in allScenes)){
        var aliasesEnEscena = await BeaconAlias.find({sceneName: jsonContents[i]["scene"]});
        allScenes[jsonContents[i]["scene"]] = aliasesEnEscena.length;
        if(aliasesEnEscena.length == 0)
          longsIds[jsonContents[i]["scene"]] = {};
      }
      if (allScenes[jsonContents[i]["scene"]] == 0 && jsonContents[i]["color"] != "all_exited_color_not_known") {
        if(!(jsonContents[i]["longid"] in longsIds[jsonContents[i]["scene"]])){
          var thealias = jsonContents[i]["color"]+ "-" + jsonContents[i]["longid"].substr(0, 2);
          longsIds[jsonContents[i]["scene"]][jsonContents[i]["longid"]] = jsonContents[i]["color"];
          await BeaconAlias.create({
            sceneName: jsonContents[i]["scene"],
            longid: jsonContents[i]["longid"],
            alias: thealias
          });
        }
      }
    }

    var aliasesEnEscena = await BeaconAlias.find({});


    var salida = await sails.helpers.preprocess(jsonContents);
    var items = salida[0];
    var scenes = salida[1];

    // Respond with view.
    return exits.success({items: items, scenes: scenes, aliases: aliasesEnEscena});

  }


};
