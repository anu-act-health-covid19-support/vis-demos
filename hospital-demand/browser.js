const p5 = require("p5");

const hospitalDemandP5 = new p5(sketch => {
  // variables
  let newcasedata = [1, 0, 0, 0, 1, 0, 1, 1, 2, 3, 10, 13, 7, 5, 9, 9, 9, 6];
  let newcases;
  let cumcases = [];
  let projcases = [];
  let icuAdmissions = [];
  let icuCount = [];
  let datadays = newcasedata.length;
  let projdays = 35;
  let growthRate = 1.08;
  let icuRate = 0.05;
  let icuStay = 10;
  let icuCapacity = 31;

  let ybase = 550;
  let yscale = 4;
  let xbase = 40;
  let xspace = 10;

  let growthSlider;
  let icuRateSlider;
  let icuStaySlider;

  // helper functions
  function buildData() {
    cumcases = [];
    projcases = [];
    icuCount = [];
    icuAdmissions = [];
    newcases = newcasedata.slice();
    var cum = 0;

    growthRate = growthSlider.value();
    icuRate = icuRateSlider.value();
    icuStay = icuStaySlider.value();

    newcases.forEach(c => {
      cum += c;
      cumcases.push(cum);
    });
    for (var p = 0; p < projdays; p++) {
      newcases.push(newcases[newcases.length - 1] * growthRate);
    }

    var casesSinceICU = 0;

    newcases.forEach((n, i) => {
      casesSinceICU += n;
      if (casesSinceICU > 1 / icuRate) {
        var casesToAdd = Math.floor(casesSinceICU / (1 / icuRate));
        for (var nc = 0; nc < casesToAdd; nc++) {
          icuAdmissions.push({
            inDate: i,
            outDate: i + icuStay
          });
        }
        casesSinceICU = casesSinceICU % casesToAdd;
      }
    });

    newcases.forEach((n, i) => {
      var ic = icuAdmissions.filter(c => {
        return c.inDate < i && c.outDate > i;
      }).length;
      icuCount.push(ic);
    });
  }

  // p5 lifecycle functions
  sketch.setup = () => {
    sketch.createCanvas(600, 600);
    growthSlider = sketch.createSlider(0.8, 1.3, growthRate, 0.01);
    growthSlider.position(80, 200);
    growthSlider.changed(function() {
      buildData();
    });
    growthSlider.style("width", "300px");

    icuRateSlider = sketch.createSlider(0.01, 0.1, icuRate, 0.005);
    icuRateSlider.position(80, 215);
    icuRateSlider.changed(function() {
      buildData();
    });
    icuRateSlider.style("width", "100px");

    icuStaySlider = sketch.createSlider(5, 15, icuStay, 1);
    icuStaySlider.position(80, 230);
    icuStaySlider.changed(function() {
      buildData();
    });
    icuStaySlider.style("width", "100px");

    buildData();
  };

  sketch.draw = () => {
    sketch.background(220);

    for (var t = 0; t < 500; t += 10) {
      sketch.textSize(8);
      sketch.text(t, 20, ybase - t * yscale);
      sketch.stroke(0, 20);
      sketch.line(
        35,
        ybase - t * yscale,
        sketch.width - 10,
        ybase - t * yscale
      );
    }
    sketch.noStroke();

    for (var i = 0; i < newcases.length; i++) {
      var nh = newcases[i] * yscale;
      sketch.fill(255);
      if (i > datadays) sketch.fill(180);
      sketch.rect(xbase + i * xspace, ybase - nh, xspace * 0.8, nh);
      // if (i>0) {
      //   line(xbase + i*xspace,ybase - cumcases[i]*yscale, xbase + (i-1)*xspace,ybase - cumcases[i-1]*yscale)
      // }

      sketch.fill("orange");
      var ih = icuCount[i] * yscale;
      sketch.rect(xbase + i * xspace, ybase - ih, xspace * 0.8, ih);

      if (icuCount[i] > icuCapacity) {
        sketch.fill("red");
        var oh = (icuCount[i] - icuCapacity) * yscale;
        sketch.rect(
          xbase + i * xspace,
          ybase - icuCapacity * yscale - oh,
          xspace * 0.8,
          oh
        );
      }
    }
    sketch.fill(255, 120);
    sketch.rect(60, 40, 400, 120);
    sketch.textSize(10);
    sketch.fill(0);
    sketch.text("daily growth factor: " + growthRate, 80, 72);
    sketch.text("ICU rate: " + (icuRate * 100).toFixed(1) + "%", 190, 120);
    sketch.text("ICU stay length: " + icuStay + " days", 190, 140);
  };
}, document.getElementById("p5sketch"));
