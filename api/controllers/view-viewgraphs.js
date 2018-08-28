module.exports = async function (req, res) {

  /*var aws = require('aws-sdk');
  aws.config.loadFromPath('./aws-config.json');

  var docClient = new aws.DynamoDB.DocumentClient();
  console.log(docClient);
  params={
    TableName:"beaconsmla-mobilehub-1326480574-ProximityEventAWS"
  };

  docClient.scan(params,function(err,result) {
    console.log("entro al scan");
    console.log(aws.config.credentials);
    if(err) {
        console.log(err);
    } else {
      var items = result.Items;
      console.log(items);
      if(result.LastEvaluatedKey) {

          params.ExclusiveStartKey = result.LastEvaluatedKey;
          console.log("last");             
      } else {
          console.log(err,items);
      }   
    }
    });*/
  var fs = require("fs");
  var contents = fs.readFileSync("sample-data/sample-data2-realesexpkarla-malos.json");
  var jsonContents = JSON.parse(contents);

  var salida = await sails.helpers.preprocess(jsonContents);
  var items = salida[0];
  var scenes = salida[1];
  //return exits.success();
  return res.view('pages/viewgraphs', {
    items: items,
    scenes: scenes
  });

}
