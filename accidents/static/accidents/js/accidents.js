var raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

var county = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "/countyGeoJSON/",
    format: new ol.format.GeoJSON(),
  }),
});

// heatmap section
let heatmapLayer = new ol.layer.Heatmap({
  source: new ol.source.Vector(),
  radius: 8,
  blur: 15,
});
// end of heatmap section
window.accident = new ol.layer.Vector();

var map = new ol.Map({
  layers: [raster, county, accident, heatmapLayer],
  target: "map",
  view: new ol.View({
    center: [-44398.4082, 7162552.5802],
    zoom: 6,
  }),
});

map.on("loadstart", () => {
  $("#spinner").prop("hidden", false);
});

map.on("loadend", () => {
  $("#spinner").prop("hidden", true);
});

var select = new ol.interaction.Select({
  layers: [county],
});

map.addInteraction(select);

select.on("select", async function (e) {
  if (e.target.getFeatures().getArray().length > 0) {
    $("#spinner").prop("hidden", false);

    let extent = e.target.getFeatures().getArray()[0].getGeometry().getExtent();
    map.getView().fit(extent);

    let countyName = e.target.getFeatures().getArray()[0].get("name");
    console.log(countyName);

    fetch(`/accidentsGeoJSON/?county=${countyName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        $("#spinner").prop("hidden", true);

        let chartHasBeenRendered = false;
        let myChart;

        let geojs_source = new ol.source.Vector({
          features: new ol.format.GeoJSON().readFeatures(data, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          }),
        });

        heatmapLayer.getSource().clear();
        accident.setSource(geojs_source);

        // heatmap section
        let featList = accident.getSource().getFeatures();
        for (let item of featList) {
          let geometry = item.get("geometry");
          let coordinate = geometry.flatCoordinates;
          let feature = new ol.Feature({
            geometry: new ol.geom.Point(coordinate),
          });
          heatmapLayer.getSource().addFeature(feature);
        }
        // end of heatmap section

        // graph function goes here
        let dataLabels = [];
        let no_of_accidents = [];
        let no_of_casualties = [];
        let no_of_vehicles = [];

        let severity_levels = [];
        let severity_counts = {};
        const data_features = data["features"];
        // console.log(data_features);
        for (let feature of data_features) {
          if (
            !severity_counts.hasOwnProperty(
              feature["properties"]["accident_severity"]
            )
          ) {
            severity_counts[feature["properties"]["accident_severity"]] = {
              accident_count: 1,
              casualty_total: parseInt(
                feature["properties"]["number_of_casualties"]
              ),
              vehicle_total: parseInt(
                feature["properties"]["number_of_vehicles"]
              ),
            };
          } else {
            // accident counts
            if (
              !severity_counts[
                feature["properties"]["accident_severity"]
              ].hasOwnProperty("accident_count")
            ) {
              severity_counts[feature["properties"]["accident_severity"]][
                "accident_count"
              ] = 1;
            } else {
              const count =
                severity_counts[feature["properties"]["accident_severity"]][
                  "accident_count"
                ];
              severity_counts[feature["properties"]["accident_severity"]][
                "accident_count"
              ] = parseInt(count) + 1;
            }
            // casualty total
            if (
              !severity_counts[
                feature["properties"]["accident_severity"]
              ].hasOwnProperty("casualty_total")
            ) {
              severity_counts[feature["properties"]["accident_severity"]][
                "casualty_total"
              ] = parseInt(feature["properties"]["number_of_casualties"]);
            } else {
              const casualties =
                severity_counts[feature["properties"]["accident_severity"]][
                  "casualty_total"
                ];
              severity_counts[feature["properties"]["accident_severity"]][
                "casualty_total"
              ] =
                parseInt(casualties) +
                parseInt(feature["properties"]["number_of_casualties"]);
            }
            // vehicle totals
            if (
              !severity_counts[
                feature["properties"]["accident_severity"]
              ].hasOwnProperty("vehicle_total")
            ) {
              severity_counts[feature["properties"]["accident_severity"]][
                "vehicle_total"
              ] = parseInt(feature["properties"]["number_of_vehicles"]);
            } else {
              const vehicles =
                severity_counts[feature["properties"]["accident_severity"]][
                  "vehicle_total"
                ];
              severity_counts[feature["properties"]["accident_severity"]][
                "vehicle_total"
              ] =
                parseInt(vehicles) +
                parseInt(feature["properties"]["number_of_vehicles"]);
            }
          }
        }

        // console.log(severity_counts);

        for (let level in severity_counts) {
          dataLabels.push("Level " + level);
          no_of_accidents.push(severity_counts[level]["accident_count"]);
          no_of_casualties.push(severity_counts[level]["casualty_total"]);
          no_of_vehicles.push(severity_counts[level]["vehicle_total"]);
        }

        $("#chartDiv").empty();
        $("#chartDiv").append(
          '<canvas id="myChart" width="400" height="400"></canvas>'
        );

        let ctx = document.getElementById("myChart").getContext("2d");
        let severityData = {
          // labels: ["Level 1", "Level 2", "Level 3"],
          labels: dataLabels,
          datasets: [
            {
              label: "No of Accidents",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              // data: [29,331,1384]
              data: no_of_accidents,
            },
            {
              label: "No of Casulties",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              // data: [47,461,1809]
              data: no_of_casualties,
            },
            {
              label: "No of Vehicles",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
              // data: [43,599,2616]
              data: no_of_vehicles,
            },
          ],
        };

        if (chartHasBeenRendered) {
          myChart.destroy();
          myChart.clear();
        }
        myChart = new Chart(ctx, {
          type: "bar",
          data: severityData,
          options: {
            barValueSpacing: 20,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            title: {
              display: true,
              text:
                "Statistics by Accident Severity: County=" +
                e.target.getFeatures().getArray()[0].get("name"),
            },
          },
        });
        chartHasBeenRendered = true;
      })
      .catch((error) => {
        $("#spinner").prop("hidden", true);
        console.log(error);
      });
  }
});
