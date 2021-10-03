<template>
  <div>
    <!-- <div>{{ checked }}</div> -->
    <highcharts :options="graph"></highcharts>
    <!-- {{ graph }} -->
  </div>
</template>

<script>
import axios from "axios";
import { Chart } from "highcharts-vue";
export default {
  props: ["checked", "last"],
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      graph: {
        title: {
          text: "各都道府県の総人口",
        },
        // subtitle: {
        //   text: '引用：<a href="http://www.data.jma.go.jp/obd/stats/etrn/view/monthly_s1.php?prec_no=44&block_no=47662&year=2019&month=&day=&view=">気象庁</a>',
        // },
        xAxis: {
          categories: [],
          crosshair: true,
        },
        yAxis: {
          title: false,
          labels: {
            formatter: function () {
              return this.value.toLocaleString();
            },
          },
          opposite: false,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          // pointFormat: "{series.name}：{point.y:.1f}人",
          formatter: function () {
            // console.log(this.point);
            return (
              this.point.series.name +
              "（" +
              +this.point.category +
              "年）：" +
              this.point.y.toLocaleString()
            );
          },
        },
        series: [],
      },
    };
  },
  watch: {
    checked(newV) {
      let _this = this;
      const newChecked = newV.filter(function (hero) {
        return hero.prefCode == _this.last;
      });
      if (newChecked.length > 0) {
        console.log("add", this.last);
        this.fetchPopulationComposition(newChecked[0]);
      } else {
        console.log("delete", this.last);
        this.deleteGraph();
      }
    },
  },
  async mounted() {},
  methods: {
    async fetchPopulationComposition(newChecked) {
      console.log(newChecked);
      try {
        const res = await axios.get("api/v1/population/composition/perYear", {
          params: {
            prefCode: this.last,
            cityCode: "-",
          },
        });
        // console.log(res.data);
        const result = res.data.result.data[0].data;
        console.log(result);
        let years = [];
        let values = [];
        for (let i = 0; i < result.length; i++) {
          years.push(result[i].year);
          values.push(result[i].value);
        }
        console.log(values);
        this.$set(this.graph.xAxis, "categories", years);
        // this.$set(this.graph.series[0], "data", values);
        const graphData = {
          name: newChecked.prefName,
          id: newChecked.prefCode,
          type: "line",
          data: values,
          marker: {
            enabled: true,
          },
        };
        this.graph.series.push(graphData);
      } catch (error) {
        console.log(error);
      }
    },
    deleteGraph() {
      let _this = this;
      this.graph.series = this.graph.series.filter(function (series) {
        return series.id != _this.last;
      });
      console.log(this.graph.series);
      this.graph.series.splice();
    },
  },
};
</script>

<style></style>
