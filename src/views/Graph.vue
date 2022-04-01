<template>
  <div class="graph">
    <div id="#svg" />
    <div class="sliding-menu">
      <h1>Article Name</h1>
      <p>Article Description</p>
      <p>Article abstract</p>
      <button>Share</button>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import * as d3 from "d3";
import mis from '@/assets/mis.json';

@Component({
  components: {
  },
})
export default class Graph extends Vue {
  miserables = mis;
  query = this.$route.params.query;
  initGraph(data) {
    this.chart = ForceGraph(data, {
      nodeId: d => d.id,
      nodeGroup: d => d.group,
      nodeTitle: d => `${d.id}\n${d.group}`,
      linkStrokeWidth: l => Math.sqrt(l.value),
      height: 1100,
    })
    this.chart.setAttribute('id', 'force-graph');
    d3.select('.graph').node().append(this.chart);

    function zoomIn3() { // Correct way
      const inner = document.getElementById("force-graph");
      alert('hey')
      inner.setAttribute("transform", "scale(0.8)");
    }

  }
  api() {
    return fetch('https://backend.shirator.net/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        args: [this.query, 0],
      }),
    })
        .then(response => response.json())
      .then(async data => {
        console.log(data);
        return data.graph;
      });
  }
  created() {

    console.log('query:' + this.query)

    this.api().then(data => {
      console.log(data);
      this.initGraph(data)
    });

    function zoomIn3() { // Correct way
      const inner = document.getElementById("force-graph");
      alert('hey')
      inner.setAttribute("transform", "scale(0.8)");
    }

    window.addEventListener('scroll', this.handleScroll);
  }
  mounted() {

    // window.addEventListener("scroll", zoomIn3);
    // document.getElementById("force-graph").addEventListener('scroll', zoomIn3);
  }
}
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
function ForceGraph({
                      nodes, // an iterable of node objects (typically [{id}, …])
                      links // an iterable of link objects (typically [{source, target}, …])
                    }, {
  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
  nodeGroup, // given d in nodes, returns an (ordinal) value for color
  nodeGroups, // an array of ordinal values representing the node groups
  nodeTitle, // given d in nodes, a title string
  nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
  nodeStroke = "#fff", // node stroke color
  nodeStrokeWidth = 1.5, // node stroke width, in pixels
  nodeStrokeOpacity = 1, // node stroke opacity
  nodeRadius = 10, // node radius, in pixels
  nodeStrength,
  linkSource = ({source}) => source, // given d in links, returns a node identifier string
  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
  linkStroke = "#999", // link stroke color
  linkStrokeOpacity = 0.6, // link stroke opacity
  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
  linkStrokeLinecap = "round", // link stroke linecap
  linkStrength = 0.1,
  colors = d3.schemeTableau10, // an array of color strings, for the node groups
                      width = 1800, // outer width, in pixels
                      height = 800, // outer height, in pixels
                      invalidation, // when this promise resolves, stop the simulation
                      clickaction = ({ _ }) => console.log("alert"),
                    } = {}) {
  // Compute values.
  const N = d3.map(nodes, nodeId).map(intern);
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
  const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
  const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
  const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);


  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
  links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

  // Compute default domains.
  if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

  // Construct the scales.
  const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
  if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
  if (linkStrength !== undefined) forceLink.strength(linkStrength);

  const simulation = d3.forceSimulation(nodes)
      .force("link", forceLink)
      .force("charge", forceNode)
      .force("center",  d3.forceCenter())
      .on("tick", ticked);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const link = svg.append("g")
      .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
      .attr("stroke-opacity", linkStrokeOpacity)
      .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
      .attr("stroke-linecap", linkStrokeLinecap)
      .selectAll("line")
      .data(links)
      .join("line");

  const node = svg.append("g")
      .attr("fill", nodeFill)
      .attr("stroke", nodeStroke)
      .attr("stroke-opacity", nodeStrokeOpacity)
      .attr("stroke-width", nodeStrokeWidth)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", nodeRadius)
      .call(drag(simulation))
      .on("click", d => {
        clickaction(d)
      });

  if (W) link.attr("stroke-width", ({index: i}) => W[i]);
  if (L) link.attr("stroke", ({index: i}) => L[i]);
  if (G) node.attr("fill", ({index: i}) => color(G[i]));
  if (T) node.append("title").text(({index: i}) => T[i]);
  if (invalidation != null) invalidation.then(() => simulation.stop());

  function intern(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
  }

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

  return Object.assign(svg.node(), {scales: {color}});
}
</script>

<style>
#force-graph {
  height: 80%;
  bottom: 0;
  width: 70%;
  position: fixed;
  left: 0;
  transform: scale(1.55);
}
.sliding-menu {
  height: 100%;
  width: 30%;
  position: fixed;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,.19);

  padding-top: 5rem ;
  padding-left: 4rem;
  padding-right: 4rem;

  text-align: left;
}
circle:hover {
  stroke: #a2d9ff;
  stroke-width: 3px;
}
#force-graph {

}
</style>
