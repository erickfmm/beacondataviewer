var mivariable = {};
parasails.registerPage('viewgraphs', {
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
  beforeMount: function () {
    // Attach any initial data from the server.

    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function () {
    //…

    this.items = SAILS_LOCALS.items;
    console.log(SAILS_LOCALS);
    console.log(this.items);
    thecolors = {};
    for (const i in this.items) {
      if (this.items[i]["color"] != "all_exited_color_not_known") {
        thecolors[this.items[i]["longid"]] = this.items[i]["color"];
      }
      //this.items[i]["timeEv"] /= (1000.0);
      //this.items[i]["timeInterval"] /= (1000.0);
    }

    for (const i in this.items) {
      if (this.items[i]["longid"] in thecolors) {
        this.items[i]["longid"] = thecolors[this.items[i]["longid"]] + "-" + this.items[i]["longid"].substr(0, 2);
      } else {
        this.items[i]["longid"] = this.items[i]["longid"].substr(0, 4);
      }
    }

    this.originalItems = this.items.slice();

    //console.log(this.items);
    this.sceneChanged();


  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    plotGraphs: function () {
      console.log(this.makeHierarchihalDataD3());
      console.log(this.makeDataForces());
      console.log("clean elements");
      $("#svgTreemapSquare").html("");
      $("#svgCirclePacking").html("");
      $("#svgGraphForces").html("");
      console.log("to put graphs");
      console.log(this.makeTimelineData());
      this.putTreeMap(this.makeHierarchihalDataD3(), "#svgTreemapSquare");
      this.putCirclePacking(this.makeHierarchihalDataD3(), "#svgCirclePacking");
      this.putGraphForces(this.makeDataForces(), "#svgGraphForces");
      this.putTimelineChart(this.makeTimelineData(), "#svgTimelineGraph");
      console.log("plot graphs done");
    },
    sceneChanged: function () {
      console.log("escena cambio");
      var sceneName = document.getElementById("selectScene").value;
      var nuevositems = [];
      for (const el of this.originalItems) {
        if (el["scene"] == sceneName) {
          nuevositems.push(el);
        }
      }
      this.items = nuevositems;
      console.log(sceneName);
      console.log(this.items);
      console.log(this.originalItems);
      this.plotGraphs();
    },
    makeDataForces: function () {
      var data = {
        "nodes": [],
        "links": []
      };
      var persons = [];
      var beacsPerPerson = {};
      var i = 0;
      for (const el of this.items) {
        if (el["timeInterval"] == 0) {
          continue;
        }
        if (persons.indexOf(el["username"]) == -1) {
          data["nodes"].push({
            "id": el["username"],
            "group": ++i
          });
          persons.push(el["username"]);
          beacsPerPerson[el["username"]] = {};
        }
      }
      for (const el of this.items) {
        if (el["timeInterval"] == 0) {
          continue;
        }
        if (el["longid"] in beacsPerPerson[el["username"]]) {
          beacsPerPerson[el["username"]][el["longid"]] += 1;
        } else {
          beacsPerPerson[el["username"]][el["longid"]] = 1;
        }
      }

      for (const personName1 in beacsPerPerson) {
        for (const longid in beacsPerPerson[personName1]) {
          for (const personName2 in beacsPerPerson) {
            if (personName1 != personName2 && longid in beacsPerPerson[personName2]) {
              let existsLink = false;
              for (const iLinks in data["links"]) {
                if (data["links"][iLinks]["source"] == personName1 && data["links"][iLinks]["target"] == personName2) {
                  data["links"][iLinks]["value"] += beacsPerPerson[personName1][longid];
                  existsLink = true;
                }
              }
              if (!existsLink) {
                data["links"].push({
                  "source": personName1,
                  "target": personName2,
                  "value": beacsPerPerson[personName1][longid]
                });
              }
            }
          }
        }
      }
      return data;

    },

    putGraphForces: function (graph, selector) {
      var svg = d3.select(selector),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
          return d.id;
        }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


      var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        });

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
          return color(d.group);
        })
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      node.append("title")
        .text(function (d) {
          return d.id;
        });

      simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph.links);

      function ticked() {
        link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
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
    putCirclePacking: function (root, selector) {
      var svg = d3.select(selector),
        diameter = +svg.attr("width"),
        g = svg.append("g").attr("transform", ""), //"translate(2,2)"),
        format = d3.format(",d");

      var pack = d3.pack()
        .size([diameter - 4, diameter - 4]);


      root = d3.hierarchy(root)
        .sum(function (d) {
          return d.size;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        });

      var node = g.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function (d) {
          return d.children ? "node" : "leaf node";
        })
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      node.append("title")
        .text(function (d) {
          return d.data.name + "\n" + format(d.value);
        });

      node.append("circle")
        .attr("r", function (d) {
          return d.r;
        });

      node.filter(function (d) {
          return !d.children;
        }).append("text")
        .attr("dy", "0.3em")
        .text(function (d) {
          return d.data.name.substring(0, d.r / 3);
        });
    },



    putTreeMap: function (data, selector) {
      var svg = d3.select(selector),
        width = +svg.attr("width"),
        height = +svg.attr("height");

      var fader = function (color) {
          return d3.interpolateRgb(color, "#fff")(0.2);
        },
        color = d3.scaleOrdinal(d3.schemeCategory10.map(fader)),
        format = d3.format(",d");

      var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(1);


      var root = d3.hierarchy(data)
        .eachBefore(function (d) {
          d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
        })
        .sum(sumBySize)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value;
        });

      treemap(root);

      var cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", function (d) {
          return "translate(" + d.x0 + "," + d.y0 + ")";
        });

      cell.append("rect")
        .attr("id", function (d) {
          return d.data.id;
        })
        .attr("width", function (d) {
          return d.x1 - d.x0;
        })
        .attr("height", function (d) {
          return d.y1 - d.y0;
        })
        .attr("fill", function (d) {
          return color(d.parent.data.id);
        });

      cell.append("clipPath")
        .attr("id", function (d) {
          return "clip-" + d.data.id;
        })
        .append("use")
        .attr("xlink:href", function (d) {
          return "#" + d.data.id;
        });

      cell.append("text")
        .attr("clip-path", function (d) {
          return "url(#clip-" + d.data.id + ")";
        })
        .selectAll("tspan")
        .data(function (d) {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", function (d, i) {
          return 13 + i * 10;
        })
        .text(function (d) {
          return d;
        });

      cell.append("title")
        .text(function (d) {
          return d.data.id + "\n" + format(d.value);
        });

      d3.selectAll("input")
        .data([sumBySize, sumByCount], function (d) {
          return d ? d.name : this.value;
        })
        .on("change", changed);

      var timeout = d3.timeout(function () {
        d3.select("input[value=\"sumByCount\"]")
          .property("checked", true)
          .dispatch("change");
      }, 2000);

      function changed(sum) {
        timeout.stop();

        treemap(root.sum(sum));

        cell.transition()
          .duration(750)
          .attr("transform", function (d) {
            return "translate(" + d.x0 + "," + d.y0 + ")";
          })
          .select("rect")
          .attr("width", function (d) {
            return d.x1 - d.x0;
          })
          .attr("height", function (d) {
            return d.y1 - d.y0;
          });
      }

      function sumByCount(d) {
        return d.children ? 0 : 1;
      }

      function sumBySize(d) {
        return d.size;
      }
    },

    makeHierarchihalDataD3: function () {
      var data = {
        "name": "root",
        "children": []
      };
      var addedChildrens = [];
      var addedIds = {};


      for (const el of this.items) {
        if (el["timeInterval"] == 0) {
          continue;
        }
        if (addedChildrens.indexOf(el["username"]) == -1) {
          addedChildrens.push(el["username"]);
          addedIds[el["username"]] = [];
          data["children"].push({
            "name": el["username"],
            "children": []
          });
        }
        for (const iChild in data["children"]) {
          if (data["children"][iChild]["name"] == el["username"]) {
            //console.log("es username: " + el["username"]);

            for (const iChildUser in data["children"][iChild]["children"]) {
              //console.log(data["children"][iChild]["children"][iChildUser]);
              if (addedIds[el["username"]].indexOf(el["longid"]) == -1) {
                addedIds[el["username"]].push(el["longid"]);
                data["children"][iChild]["children"].push({
                  "name": el["longid"],
                  "size": Math.trunc(el["timeInterval"])
                });
              } else {
                data["children"][iChild]["children"][iChildUser]["size"] = Math.trunc(el["timeInterval"] + data["children"][iChild]["children"][iChildUser]["size"]);
              }
            }
            if (data["children"][iChild]["children"].length == 0) {
              addedIds[el["username"]].push(el["longid"]);
              data["children"][iChild]["children"].push({
                "name": el["longid"],
                "size": Math.trunc(el["timeInterval"])
              });
            }
          }
        }
      }
      //console.log(addedIds);
      //console.log(addedChildrens);
      return data;
    },
    makeTimelineData: function () {
      var lanes = []; //persons
      var timeBegin = Infinity;
      var timeEnd = 0;
      var items = [];
      for (const el of this.items) {
        if (lanes.indexOf(el["username"]) == -1 && el["timeInterval"] > 0) { //no esta
          lanes.push(el["username"]);
        }
        if(el["timeEv"] < timeBegin){
          timeBegin = el["timeEv"];
        }
      }
      //console.log("time begin: ",timeBegin);
      for (const el of this.items) {
        if (el["timeInterval"] > 0) {
          if (el["timeEv"] > timeEnd) {
            timeEnd = el["timeEv"];
          }
          //console.log("begin: ", (el["timeEv"] - el["timeInterval"]));
          //console.log("end: ", el["timeEv"]);
          items.push({
            "lane": lanes.indexOf(el["username"]),
            "id": el["longid"],
            "start": (el["timeEv"] - el["timeInterval"]) - timeBegin,
            "end": el["timeEv"] - timeBegin
          })
        }
      }
      timeEnd = timeEnd - timeBegin;
      timeBegin = 0;
      var laneLength = lanes.length;
      return {
        lanes,
        laneLength,
        items,
        timeBegin,
        timeEnd
      };

    },
    putTimelineChart: function (data, selector) {
      var m = [20, 15, 15, 120], //top right bottom left
        w = 960 - m[1] - m[3],
        h = 500 - m[0] - m[2],
        miniHeight = data.laneLength * 12 + 50,
        mainHeight = h - miniHeight - 50;

      //scales
      var x = d3.scaleLinear()
        .domain([data.timeBegin, data.timeEnd])
        .range([0, w]);
      var x1 = d3.scaleLinear()
        .range([0, w]);
      var y1 = d3.scaleLinear()
        .domain([0, data.laneLength])
        .range([0, mainHeight]);
      var y2 = d3.scaleLinear()
        .domain([0, data.laneLength])
        .range([0, miniHeight]);

      var chart = d3.select(selector)
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .attr("class", "chart");

      chart.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", mainHeight);

      var main = chart.append("g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
        .attr("width", w)
        .attr("height", mainHeight)
        .attr("class", "main");

      var mini = chart.append("g")
        .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
        .attr("width", w)
        .attr("height", miniHeight)
        .attr("class", "mini");

      //main lanes and texts
      main.append("g").selectAll(".laneLines")
        .data(data.items)
        .enter().append("line")
        .attr("x1", m[1])
        .attr("y1", function (d) {
          return y1(d.lane);
        })
        .attr("x2", w)
        .attr("y2", function (d) {
          return y1(d.lane);
        })
        .attr("stroke", "lightgray")

      main.append("g").selectAll(".laneText")
        .data(data.lanes)
        .enter().append("text")
        .text(function (d) {
          return d;
        })
        .attr("x", -m[1])
        .attr("y", function (d, i) {
          return y1(i + .5);
        })
        .attr("dy", ".5ex")
        .attr("text-anchor", "end")
        .attr("class", "laneText");

      //mini lanes and texts
      mini.append("g").selectAll(".laneLines")
        .data(data.items)
        .enter().append("line")
        .attr("x1", m[1])
        .attr("y1", function (d) {
          return y2(d.lane);
        })
        .attr("x2", w)
        .attr("y2", function (d) {
          return y2(d.lane);
        })
        .attr("stroke", "lightgray");

      mini.append("g").selectAll(".laneText")
        .data(data.lanes)
        .enter().append("text")
        .text(function (d) {
          return d;
        })
        .attr("x", -m[1])
        .attr("y", function (d, i) {
          return y2(i + .5);
        })
        .attr("dy", ".5ex")
        .attr("text-anchor", "end")
        .attr("class", "laneText");

      var itemRects = main.append("g")
        .attr("clip-path", "url(#clip)");

      //mini item rects
      mini.append("g").selectAll("miniItems")
        .data(data.items)
        .enter().append("rect")
        .attr("class", function (d) {
          return "miniItem" + d.lane;
        })
        .attr("x", function (d) {
          return x(d.start);
        })
        .attr("y", function (d) {
          return y2(d.lane + .5) - 5;
        })
        .attr("width", function (d) {
          return x(d.end - d.start);
        })
        .attr("height", 10);

      //mini labels
      mini.append("g").selectAll(".miniLabels")
        .data(data.items)
        .enter().append("text")
        .text(function (d) {
          return d.id;
        })
        .attr("x", function (d) {
          return x(d.start);
        })
        .attr("y", function (d) {
          return y2(d.lane + .5);
        })
        .attr("dy", ".5ex");

      //brush
      var brush = d3.brushX(x)
        .on("brush", display);

      mini.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", 1)
        .attr("height", miniHeight - 1);

      display();

      function display() {
        var rects, labels,
          minExtent = brush.extent()[0],
          maxExtent = brush.extent()[1],
          visItems = data.items.filter(function (d) {
            return d.start < maxExtent && d.end > minExtent;
          });
          /*console.log("brush",brush);
          console.log("extent()",brush.extent());
          console.log("minExtent",minExtent);
          console.log("maxextent",maxExtent);
          console.log("extent()[0]",brush.extent()[0]);
          console.log("extent",brush.extent);
          console.log("extent[0]",brush.extent[0]);
          //console.log("extent[0]()",brush.extent[0]());
          console.log("extent[1]",brush.extent[1]);
          console.log("visit", visItems);
          mivariable = brush;
          console.log("holiwiwiwiwiwiwiiwiws");*/
          if(typeof(minExtent) != typeof(undefined) && typeof(maxExtent) != typeof(undefined)){
            mini.select(".brush")
                .call(brush.extent([minExtent, maxExtent]));
                x1.domain([minExtent, maxExtent]);
          }

        

        

        //update main item rects
        rects = itemRects.selectAll("rect")
          .data(visItems, function (d) {
            return d.id;
          })
          .attr("x", function (d) {
            return x1(d.start);
          })
          .attr("width", function (d) {
            return x1(d.end) - x1(d.start);
          });

        rects.enter().append("rect")
          .attr("class", function (d) {
            return "miniItem" + d.lane;
          })
          .attr("x", function (d) {
            return x1(d.start);
          })
          .attr("y", function (d) {
            return y1(d.lane) + 10;
          })
          .attr("width", function (d) {
            return x1(d.end) - x1(d.start);
          })
          .attr("height", function (d) {
            return .8 * y1(1);
          });

        rects.exit().remove();

        //update the item labels
        labels = itemRects.selectAll("text")
          .data(visItems, function (d) {
            return d.id;
          })
          .attr("x", function (d) {
            return x1(Math.max(d.start, minExtent) + 2);
          });

        labels.enter().append("text")
          .text(function (d) {
            return d.id;
          })
          .attr("x", function (d) {
            return x1(Math.max(d.start, minExtent));
          })
          .attr("y", function (d) {
            return y1(d.lane + .5);
          })
          .attr("text-anchor", "start");

        labels.exit().remove();

      }

    }

  }
});
