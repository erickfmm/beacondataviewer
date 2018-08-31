module.exports = {


  friendlyName: 'Modify alias',


  description: '',


  inputs: {
    scene: {
      type: 'string'
    },
    aliases: {
      type: 'json'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    console.log("entro al post modify");
    console.log(inputs);
    for(var id in inputs.aliases){
      var updatedAliases = await BeaconAlias.update({
        sceneName: inputs.scene,
        longid: id
      }).set({
        alias: inputs.aliases[id]
      }).fetch();
      console.log(updatedAliases);
      //console.log({scene: inputs.scene, longid: id, alias: inputs.aliases[id]});
    }
    return exits.success();

  }


};
