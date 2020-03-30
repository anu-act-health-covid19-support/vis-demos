const ProgressBar = require("progressbar.js");

// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

const analysisMSec = 5 * 1000; // 5 sec

const bar = new ProgressBar.Line("#progress-bar", {
  strokeWidth: 4,
  easing: "easeInOut",
  duration: analysisMSec,
  color: "#118bee",
  trailColor: "#eee",
  trailWidth: 1,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    style: {
      color: "#999",
      position: "relative",
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: true
  },
  from: { color: "#22EA82" },
  to: { color: "#ED6A5A" },
  step: (state, bar) => {
    bar.setText(
      `processing: data analysis ${Math.round(bar.value() * 100)}% complete`
    );
  }
});

bar.animate(1); // Number from 0.0 to 1.0

// based on Charles' code
const revealAnswer = () => {
  document.getElementById("progress-bar").remove();
  document.getElementById("answer-section").style.visibility = "visible";
};
const timer = setTimeout(revealAnswer, analysisMSec + 100);
