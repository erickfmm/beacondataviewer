parasails.registerPage('configurescene', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    items: [],
    originalItems: [],
    syncing: false,
    scenes: [],
    longids: [],
  
      // Form data
      formData: { /* … */ aliases: {}},
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
    this.items = SAILS_LOCALS.items;
    this.scenes = SAILS_LOCALS.scenes;
    for(var i in this.items){
      var alias = {};
      for(const al of SAILS_LOCALS.aliases){
        if(al["sceneName"] == this.items[i]["scene"] && al["longid"] == this.items[i]["longid"]){
          alias = al;
          break;
        }
      }
      this.items[i]["alias"] = alias["alias"];
    }
    console.log(SAILS_LOCALS.aliases);
    this.originalItems = this.items.slice();
    
    //$("#formfieldBeacons").submit(this.uploadBeaconsNewName);
    //this.sceneChanged();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    putBeaconsInTable: function(){
      this.longids = [];
      for(const i in this.items){
        if (this.items[i]["color"] != "all_exited_color_not_known") {
          var founded = false;
          for(const lid of this.longids){
            if(lid.longid== this.items[i]["longid"]){
              founded = true;
              break;
            }
          }
          if(founded == false){
            this.longids.push({
              color: this.items[i]["color"],
              alias: this.items[i]["alias"],
              longid: this.items[i]["longid"]
            });
          }
        }
      }
      console.log("ids", this.longids);
      console.log("formdata",this.formData);
      //this.formData.aliases = {};
      /*for(const id in longsIds){
          document.getElementById("tabletomodifyTbody").insertRow(-1).innerHTML = "<td>"+id+"</td><td>"+longsIds[id].color+"</td><td><input class='form-control' type='text' id='"+id+"'value='"+longsIds[id].alias+"' v-model='formData.L"+id+"'></input></td>";
      }*/
  
    },
    sceneChanged: function(){
      console.log("escena cambio");
      this.formData.aliases={};
      console.log(this.formData);
      //$("#tabletomodify").find("tbody").html("");
      var sceneName = document.getElementById("selectScene").value;
      var nuevositems = [];
      for (const el of this.originalItems) {
        if (el["scene"] == sceneName) {
          nuevositems.push(el);
        }
      }
      this.items = nuevositems;
      console.log("items", this.items);
      console.log("orig", this.originalItems);
      this.putBeaconsInTable();
    },
    uploadBeaconsNewName: function(){
      syncing = true;
      console.log("to updateee");
      console.log(this.formData);
      //console.log(ev);
      //var l = await Cloud.modifyAlias();
      //console.log(l);
      //ev.preventDefault();
    }
  }
});
