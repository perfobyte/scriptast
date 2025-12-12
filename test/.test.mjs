import {program, parse, Node} from "../0.js";
import test from "node:test";
import assert from "node:assert/strict";

(() => {
  var
    text = r => {
      var
        ct = (r.headers.get("content-type") || "").toLowerCase(),
        url = r.url
      ;
      assert.ok(r.ok, `HTTP ${r.status} for ${url}`);
      assert.ok(
        ct.includes("javascript") || ct.includes("text/plain"),
        `Unexpected content-type ${ct} for ${url}`
      );
      return r.text()
    },
    links = [
      "https://unpkg.com/cesium@1.136.0/Build/CesiumUnminified/Cesium.js",
      "https://unpkg.com/cesium@1.136.0/Build/Cesium/Cesium.js",
      "https://unpkg.com/typescript@5.9.3/lib/typescript.js",
      "https://unpkg.com/babylonjs@6.48.0/babylon.js",
      "https://unpkg.com/plotly.js-dist-min@2.35.2/plotly.min.js",
      "https://unpkg.com/shaka-player@4.15.4/dist/shaka-player.compiled.js",
      "https://unpkg.com/three@0.180.0/build/three.module.min.js",
      "https://unpkg.com/@tensorflow/tfjs@4.22.0/dist/tf.min.js",
      "https://unpkg.com/onnxruntime-web@1.21.0/dist/ort.min.js",
    ],

    answer_then = (
      (source, index) => {
        var
          root = 
            parse(
              source,
              program(Node, []),
              0,
              source.length,
              Node,
              Array
            )
          ,
          out = root.toString(),

          link = links[index]
        ;
        assert.equal(out.length, source.length, `${link}: length differs`);
        assert.equal(out, source, `${link}: content differs`);

        console.log(
          link,
          "output:", source.length,
          "input:", out.length,
          "length:", source.length === out.length,
          "content:", source === out
        );
        return source === root.toString()
      }
    )
  ;
    
  Promise.all(
    links
    .map(
      (link) => fetch(link).then(text)
    )
  )
  .then(
    (promises) => {
      promises.map(answer_then)
    }
  )
})();
