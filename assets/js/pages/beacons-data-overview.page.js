parasails.registerPage('beacons-data-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…

    
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.

    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
/*
    var aws_app_analytics = 'enable';
    var aws_cognito_identity_pool_id = 'us-east-1:34c7782f-b4d0-4044-879a-37cb750775f2';
    var aws_cognito_region = 'us-east-1';
    var aws_content_delivery = 'enable';
    var aws_content_delivery_bucket = 'beaconsmla-hosting-mobilehub-1326480574';
    var aws_content_delivery_bucket_region = 'sa-east-1';
    var aws_content_delivery_cloudfront = 'enable';
    var aws_content_delivery_cloudfront_domain = 'd1rwclss8mzusb.cloudfront.net';
    var aws_dynamodb = 'enable';
    var aws_dynamodb_all_tables_region = 'sa-east-1';
    var aws_dynamodb_table_schemas = [{"tableName":"beaconsmla-mobilehub-1326480574-ProximityEventAWS","attributes":[{"name":"username","type":"S"},{"name":"timeEv","type":"N"},{"name":"color","type":"S"},{"name":"longid","type":"S"},{"name":"scene","type":"S"},{"name":"timeInterval","type":"N"},{"name":"type","type":"S"}],"indexes":[],"region":"sa-east-1","hashKey":"username","rangeKey":"timeEv"}];
    var aws_mobile_analytics_app_id = '0862381a37634c11abc57b21cd87df43';
    var aws_mobile_analytics_app_region = 'us-east-1';
    var aws_project_id = 'e61218c3-d074-437c-bd3f-12ee61d28e1b';
    var aws_project_name = 'Beacons-MLA';
    var aws_project_region = 'sa-east-1';
    var aws_resource_name_prefix = 'beaconsmla-mobilehub-1326480574';

    AWS.config.region = aws_project_region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: aws_cognito_identity_pool_id
      }, {
        region: aws_cognito_region,
        accessKeyId: "AKIAIAESCAGRWSG3HK7A"
      });
    AWS.config.update({customUserAgent: 'MobileHub v0.1'});


    console.log(AWS.config.credentials);



    console.log("holi entrado montado");
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(docClient);
    params={
      TableName:"beaconsmla-mobilehub-1326480574-ProximityEventAWS"
    };

    docClient.scan(params,function(err,result) {
      console.log("entro al scan");
      console.log(AWS.config.credentials);
  
            if(err) {
                console.log(err);
            } else {
                 
                items = items.concat(result.Items);
                console.log(items);
 
                if(result.LastEvaluatedKey) {
 
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    console.log("last");             
                } else {
                    console.log(err,items);
                }   
            }
        });
    console.log("salido"); */
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
  }
});
