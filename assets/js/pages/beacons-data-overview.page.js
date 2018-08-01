parasails.registerPage('beacons-data-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    items: []

    
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
    thecolors = {};
    for (const i in this.items) {
      if(this.items[i]["color"] != "all_exited_color_not_known"){
        thecolors[this.items[i]["longid"]] = this.items[i]["color"];
      }
    }

    for (const i in this.items) {
      if(this.items[i]["longid"] in thecolors){
        this.items[i]["longid"] = thecolors[this.items[i]["longid"]]+"-"+this.items[i]["longid"].substr(0,2);
      }else{
        this.items[i]["longid"] = this.items[i]["longid"].substr(0,4);
      }
    }

    console.log(this.items);
    console.log(this.makeHierarchihalDataD3());
    this.putTreeMap(this.makeHierarchihalDataD3(), "#svgTreemapSquare");
    this.putCirclePacking(this.makeHierarchihalDataD3(), "#svgCirclePacking");
    console.log(this.makeDataForces());
    this.putGraphForces(this.makeDataForces(), "#svgGraphForces");


  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    makeDataForces: function(){
      var data = {
        "nodes": [],
        "links": []
      };
      var persons = [];
      var beacsPerPerson = {};
      var i = 0;
      for (const el of this.items) {
        if(persons.indexOf(el["username"]) == -1){
          data["nodes"].push({
            "id": el["username"],
            "group": ++i
          });
          persons.push(el["username"]);
          beacsPerPerson[el["username"]] = {};
        }
      }
      for (const el of this.items) {
        if(el["longid"] in beacsPerPerson[el["username"]]){
          beacsPerPerson[el["username"]][el["longid"]] += 1;
        }else{
          beacsPerPerson[el["username"]][el["longid"]] = 1;
        }
      }

      for (const personName1 in beacsPerPerson) {
        
        for (const longid in beacsPerPerson[personName1]) {
          for (const personName2 in beacsPerPerson) {
            if(longid in beacsPerPerson[personName2]){
              data["links"].push({
                "source": personName1,
                "target": personName2,
                "value": beacsPerPerson[personName1][longid]
              });
            }
          }
        }
      }
      return data;

    },

    putGraphForces: function(graph, selector){
      var svg = d3.select(selector),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


      var link = svg.append("g")
          .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
          .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

      var node = svg.append("g")
          .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr("r", 5)
          .attr("fill", function(d) { return color(d.group); })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

      node.append("title")
          .text(function(d) { return d.id; });

      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);

      simulation.force("link")
          .links(graph.links);

      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    },
    putCirclePacking: function(root, selector){
      var svg = d3.select(selector),
      diameter = +svg.attr("width"),
      g = svg.append("g").attr("transform", ""), //"translate(2,2)"),
      format = d3.format(",d");
  
      var pack = d3.pack()
          .size([diameter - 4, diameter - 4]);
      
      
        root = d3.hierarchy(root)
            .sum(function(d) { return d.size; })
            .sort(function(a, b) { return b.value - a.value; });
      
        var node = g.selectAll(".node")
          .data(pack(root).descendants())
          .enter().append("g")
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      
        node.append("title")
            .text(function(d) { return d.data.name + "\n" + format(d.value); });
      
        node.append("circle")
            .attr("r", function(d) { return d.r; });
      
        node.filter(function(d) { return !d.children; }).append("text")
            .attr("dy", "0.3em")
            .text(function(d) { return d.data.name.substring(0, d.r / 3); });
    },



    putTreeMap: function(data, selector){
      var svg = d3.select(selector),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  
  var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
      color = d3.scaleOrdinal(d3.schemeCategory10.map(fader)),
      format = d3.format(",d");
  
  var treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .round(true)
      .paddingInner(1);
  
  
    var root = d3.hierarchy(data)
        .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum(sumBySize)
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
  
    treemap(root);
  
    var cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
  
    cell.append("rect")
        .attr("id", function(d) { return d.data.id; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("fill", function(d) { return color(d.parent.data.id); });
  
    cell.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.data.id; })
      .append("use")
        .attr("xlink:href", function(d) { return "#" + d.data.id; });
  
    cell.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
      .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
      .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function(d, i) { return 13 + i * 10; })
        .text(function(d) { return d; });
  
    cell.append("title")
        .text(function(d) { return d.data.id + "\n" + format(d.value); });
  
    d3.selectAll("input")
        .data([sumBySize, sumByCount], function(d) { return d ? d.name : this.value; })
        .on("change", changed);
  
    var timeout = d3.timeout(function() {
      d3.select("input[value=\"sumByCount\"]")
          .property("checked", true)
          .dispatch("change");
    }, 2000);
  
    function changed(sum) {
      timeout.stop();
  
      treemap(root.sum(sum));
  
      cell.transition()
          .duration(750)
          .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
        .select("rect")
          .attr("width", function(d) { return d.x1 - d.x0; })
          .attr("height", function(d) { return d.y1 - d.y0; });
    }
  
  function sumByCount(d) {
    return d.children ? 0 : 1;
  }
  
  function sumBySize(d) {
    return d.size;
  }

  function zoom(d) {
    var kx = w / d.dx, ky = h / d.dy;
    x.domain([d.x, d.x + d.dx]);
    y.domain([d.y, d.y + d.dy]);

    var t = svg.selectAll("g.cell").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    t.select("rect")
        .attr("width", function(d) { return kx * d.dx - 1; })
        .attr("height", function(d) { return ky * d.dy - 1; })

    t.select("text")
        .attr("x", function(d) { return kx * d.dx / 2; })
        .attr("y", function(d) { return ky * d.dy / 2; })
        .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

    node = d;
    d3.event.stopPropagation();
  }
    },

    makeHierarchihalDataD3: function(){
      var data = {
        "name": "root",
        "children": []
      };
      var addedChildrens = [];
      var addedIds= {};

      
      for (const el of this.items) {
        if(el["timeInterval"] == 0){
          continue;
        }
        if(addedChildrens.indexOf(el["username"]) == -1){
          addedChildrens.push(el["username"]);
          addedIds[el["username"]] = [];
          data["children"].push({
            "name": el["username"],
            "children": []
          });
        }
        for(const iChild in data["children"]){
          if(data["children"][iChild]["name"] == el["username"]){
            console.log("es username: "+ el["username"]);
            
            for (const iChildUser in data["children"][iChild]["children"]) {
              console.log(data["children"][iChild]["children"][iChildUser]);
              if(addedIds[el["username"]].indexOf(el["longid"]) == -1){
                addedIds[el["username"]].push(el["longid"]);
                data["children"][iChild]["children"].push({
                  "name": el["longid"],
                  "size": Math.trunc(el["timeInterval"])
                });
              }else{
                data["children"][iChild]["children"][iChildUser]["size"] = Math.trunc( el["timeInterval"] + data["children"][iChild]["children"][iChildUser]["size"]);
              }
            }
            if(data["children"][iChild]["children"].length == 0){
              addedIds[el["username"]].push(el["longid"]);
                data["children"][iChild]["children"].push({
                  "name": el["longid"],
                  "size": Math.trunc(el["timeInterval"])
                });
            }
          }
        }
      }
      console.log(addedIds);
      console.log(addedChildrens);
      return data;
    }

  }
});
