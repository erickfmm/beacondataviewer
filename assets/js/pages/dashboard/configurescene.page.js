parasails.registerPage('configurescene', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    items: [],
    originalItems: []
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
    this.originalItems = this.items.slice();
    $("#formfieldBeacons").submit(this.uploadBeaconsNewName);
    this.sceneChanged();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    putBeaconsInTable: function(){
      var longsIds = {};
      for(const i in this.items){
        if (this.items[i]["color"] != "all_exited_color_not_known") {
          if(!(this.items[i]["longid"] in longsIds)){
            longsIds[this.items[i]["longid"]] = this.items[i]["color"];
          }
        }
      }
      for(const id in longsIds){
          document.getElementById("tabletomodifyTbody").insertRow(-1).innerHTML = "<td>"+id+"</td><td>"+longsIds[id]+"</td><td><input class='form-control' type='text' id='field"+id+"'value='"+id+"'></input></td>";
      }
  
    },
    sceneChanged: function(){
      console.log("escena cambio");
      $("#tabletomodify").find("tbody").html("");
      var sceneName = document.getElementById("selectScene").value;
      var nuevositems = [];
      for (const el of this.originalItems) {
        if (el["scene"] == sceneName) {
          nuevositems.push(el);
        }
      }
      this.items = nuevositems;
      this.putBeaconsInTable();
    },
    uploadBeaconsNewName: function(ev){
      console.log("to updateee");
      console.log(ev);
      ev.preventDefault();
    }
  }
});
