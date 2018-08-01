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
    var contents = fs.readFileSync("sample-data/sample-data1.json");
    var jsonContents = JSON.parse(contents);
    

    var items = [];
    var sceneName = "Default";
    for(const el of jsonContents){
      if(el["scene"] == sceneName) {
        items.push(el);
      }
    }

    for (const i in items) {
      //console.log(items[i]["timeEv"]);
      var timEvD = new Date(items[i]["timeEv"]);
      //console.log(timEvD.getUTCHours());
      items[i]["timeEv"] = (timEvD.getUTCMilliseconds()*1000.0) + (timEvD.getUTCSeconds())+(timEvD.getUTCMinutes()/60.0);//+(timEvD.getUTCHours()-21)/3600.0;
      if(items[i]["timeInterval"] != 0){
        var timeInter = new Date(items[i]["timeInterval"]);
        items[i]["timeInterval"] = timeInter.getUTCMilliseconds()*1000.0 + timeInter.getUTCSeconds()+timeInter.getUTCMinutes()/60.0;//+(timeInter.getUTCHours()-21)/3600.0;
  
      }
    }
    //this.missuperitems = items;
    //this.req.items = items;
    //console.log(items);

    // Respond with view.

    //return exits.success();
    return res.view('pages/beacons-data-overview', {
      items: items
    });

  }


