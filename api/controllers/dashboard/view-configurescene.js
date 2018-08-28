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

    var salida = await sails.helpers.preprocess(jsonContents);
    var items = salida[0];
    var scenes = salida[1];

    // Respond with view.
    return exits.success({items: items, scenes: scenes});

  }


};
