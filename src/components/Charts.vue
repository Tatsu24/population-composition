<template>
  <div>
    <!-- <div>{{ checked }}</div> -->
    <div style="text-align: right">
      <button class="btn" :disabled="!checked.length" @click="allClear()">
        全チェック解除
      </button>
    </div>
    <highcharts
      v-if="checked.length > 0"
      :options="graph"
      class="charts"
    ></highcharts>
    <p v-if="!checked.length">都道府県を選択してください</p>
    <!-- {{ checked }} -->
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
        chart: {
          type: "line",
          backgroundColor: "#f9f9f9",
          border: 2,
          borderColor: "blue",
          borderRadius: 10,
          ignoreHiddenSeries: false,
        },
        title: {
          text: "各都道府県の総人口",
        },
        subtitle: {
          text: '引用：<a href="https://resas.go.jp/#/13/13101" target=”_blank rel="noopener noreferrer">RESAS 地域経済分析システム</a>',
        },
        xAxis: {
          title: {
            text: "年度",
          },
          categories: [],
          crosshair: true,
        },
        yAxis: {
          title: {
            text: "人口数",
          },
          labels: {},
          opposite: false,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          formatter: function () {
            return (
              this.point.series.name +
              "（" +
              +this.point.category +
              "年）：" +
              this.point.y.toLocaleString() +
              "人"
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
    allClear() {
      this.$emit("all-clear");
      this.graph.series.splice(0, this.graph.series.length);
    },
  },
};
</script>

<style scoped>
.btn {
  margin: 0 1.5em;
}
.charts {
  margin: 0 auto;
  padding: 1em;
  max-width: 700px;
}
</style>
