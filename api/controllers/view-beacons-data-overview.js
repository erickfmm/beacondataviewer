module.exports = {


  friendlyName: 'View beacons data overview',


  description: 'Display "Beacons data overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/beacons-data-overview'
    }

  },


  fn: async function (inputs, exits) {

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
    var contents = fs.readFileSync("sample-data/sample-data1.json");
    var jsonContent = JSON.parse(contents);
    console.log(jsonContent);

    // Respond with view.

    return exits.success();

  }


};
