import { seriesSvgAnnotation } from "./annotation-series.js";
import {
  distance,
  trunc,
  hashCode,
  webglColor,
  iterateElements
} from "./util.js";

let data = [];
let quadtree;
var expr_max = 10;
var gene = "";

const createAnnotationData = datapoint => ({
  note: {
    label: datapoint.id + " " + datapoint.expr,
    bgPadding: 5,
    title: trunc(datapoint.cluster, 100)
  },
  x: datapoint.x,
  y: datapoint.y,
  dx: 20,
  dy: 20
});

let meta;
// create a web worker that streams the chart data
const streamingLoaderWorker = new Worker("streaming-tsv-parser.js");
streamingLoaderWorker.onmessage = ({
  data: { items, totalBytes, finished }
}) => {
  const rows = items
    .map(d => ({
      ...d,
      x: Number(d.x),
      y: Number(d.y)
      }))
    .filter(d => d.x);
  data = data.concat(rows);
  
    document.getElementById("loading").style.display = "none";
    const clusterFill = d =>
        webglColor(clusterColorScale(hashCode(d.cluster) % 10));
    var fillColor = fc.webglFillColor().value(clusterFill).data(data);
        pointSeries.decorate(program => fillColor(program));
    fillColor.value(clusterFill);
    console.log(fillColor);
    quadtree = d3
          .quadtree()
          .x(d => d.x)
          .y(d => d.y)
          .addAll(data);
    redraw();
      
  if (finished) {
    const meta = data
    //console.log(meta);
    
      iterateElements(".controls a", el => {
          el.addEventListener("click", () => {
            iterateElements(".controls a", el2 => el2.classList.remove("active"));
            el.classList.add("active");
            if (el.id != "cluster") {
              gene = el.id + ".tsv";
          //console.log(gene);
              //redraw();
            }
          
          data = [];
    
    const streamingLoaderWorker2 = new Worker("streaming-tsv-parser2.js");
    streamingLoaderWorker2.onmessage = ({
      data: { items, totalBytes, finished }
    }) => {
      const rows = items
        .map(d => ({
          ...d,
          expr: d.expr
        }))
        .filter(d => d.expr);
      data = data.concat(rows);
      //console.log(rows);
      
      if (finished) {
        //console.log(data);
        //console.log(meta);
        data = _.merge(data, meta);
        //console.log(data);

        // compute the fill color for each datapoint
        const exprColorScale = d3
          .scaleSequential()
          .domain([0, expr_max])
          .interpolator(d3.interpolateReds);
  
        const exprFill = d => webglColor(exprColorScale(d.expr));
        fillColor = fc.webglFillColor().value(clusterFill).data(data);
        pointSeries.decorate(program => fillColor(program));
        // wire up the fill color selector
        //fillColor.value(el.id === "cluster" ? clusterFill : clusterFill);
        fillColor.value(el.id === "cluster" ? clusterFill : exprFill);

        // create a spatial index for rapidly finding the closest datapoint
        quadtree = d3
          .quadtree()
          .x(d => d.x)
          .y(d => d.y)
          .addAll(data);
        redraw();
        //console.log(clusterFill);
        //console.log(exprFill);

      }
      //expr_max = Math.max(...data.map(x => x.expr));
      //console.log(expr_max)
    };
    console.log(gene);
    streamingLoaderWorker2.postMessage(gene);
        });
      });
  };
};
streamingLoaderWorker.postMessage("metadata.tsv");

const clusterColorScale = d3.scaleOrdinal(d3.schemeCategory10);
const xScale = d3.scaleLinear().domain([-45, 45]);
const yScale = d3.scaleLinear().domain([-45, 45]);
const xScaleOriginal = xScale.copy();
const yScaleOriginal = yScale.copy();

const pointSeries = fc
  .seriesWebglPoint()
  .equals((a, b) => a === b)
  .size(2)
  .crossValue(d => d.x)
  .mainValue(d => d.y);

const zoom = d3
  .zoom()
  .scaleExtent([0.8, 10])
  .on("zoom", () => {
    // update the scales based on current zoom
    xScale.domain(d3.event.transform.rescaleX(xScaleOriginal).domain());
    yScale.domain(d3.event.transform.rescaleY(yScaleOriginal).domain());
    redraw();
  });

const annotations = [];

const pointer = fc.pointer().on("point", ([coord]) => {
  annotations.pop();

  if (!coord || !quadtree) {
    return;
  }

  // find the closes datapoint to the pointer
  const x = xScale.invert(coord.x);
  const y = yScale.invert(coord.y);
  const radius = Math.abs(xScale.invert(coord.x) - xScale.invert(coord.x - 20));
  const closestDatum = quadtree.find(x, y, radius);

  // if the closest point is within 20 pixels, show the annotation
  if (closestDatum) {
    annotations[0] = createAnnotationData(closestDatum);
  }

  redraw();
});

const annotationSeries = seriesSvgAnnotation()
  .notePadding(15)
  .type(d3.annotationCallout);

const chart = fc
  .chartCartesian(xScale, yScale)
  .webglPlotArea(
    // only render the point series on the WebGL layer
    fc
      .seriesWebglMulti()
      .series([pointSeries])
      .mapping(d => d.data)
  )
  .svgPlotArea(
    // only render the annotations series on the SVG layer
    fc
      .seriesSvgMulti()
      .series([annotationSeries])
      .mapping(d => d.annotations)
  )
  .decorate(sel =>
    sel
      .enter()
      .select("d3fc-svg.plot-area")
      .on("measure.range", () => {
        xScaleOriginal.range([0, d3.event.detail.width]);
        yScaleOriginal.range([d3.event.detail.height, 0]);
      })
      .call(zoom)
      .call(pointer)
  );

// render the chart with the required data
// Enqueues a redraw to occur on the next animation frame
const redraw = () => {
  d3.select("#chart").datum({ annotations, data }).call(chart);
};