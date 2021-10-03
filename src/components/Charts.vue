<template>
  <div>
    <div style="text-align: right">
      <button class="btn" :disabled="!checkedArray.length" @click="allClear()">
        全チェック解除
      </button>
    </div>
    <highcharts
      v-if="checkedArray.length > 0"
      :options="graph"
      class="charts"
    ></highcharts>
    <p v-if="!checkedArray.length" style="padding: 20px 0">
      都道府県を選択するとグラフが表示されます。
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { Chart } from "highcharts-vue";
export default {
  name: "Charts",
  props: ["checkedArray", "lastChecked"],
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      graph: {
        chart: {
          type: "line",
          backgroundColor: "#f9f9f9",
          borderRadius: 10,
        },
        title: {
          text: "都道府県別の総人口推移",
        },
        subtitle: {
          text: '引用：<a href="https://resas.go.jp/#/13/13101" target=”_blank" rel="noopener noreferrer">RESAS地域経済分析システム</a>',
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
    // チェックボックスを監視し、新しいチェックの場合はグラフの追加、削除された場合はグラフの削除を行う
    checkedArray(newV) {
      let _this = this;
      const newChecked = newV.filter(function (prefecture) {
        return prefecture.prefCode == _this.lastChecked;
      });
      if (newChecked.length > 0) {
        this.fetchPopulationComposition(newChecked[0]);
      } else {
        this.deleteGraph();
      }
    },
  },
  methods: {
    /**
     * RESAS APIで総人口を取得する
     * @param {Object} prefecture - 都道府県一覧で取得した都道府県番号と都道府県名
     */
    async fetchPopulationComposition(prefecture) {
      try {
        const res = await axios.get("api/v1/population/composition/perYear", {
          params: {
            prefCode: this.lastChecked,
            cityCode: "-",
          },
        });
        const population = res.data.result.data[0].data;
        this.drawGraph(prefecture, population);
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * グラフを描画する
     * @param {Object} prefecture - 都道府県一覧で取得した都道府県番号と都道府県名
     * @param {array} population - 1960年から2045年までの総人口推移の配列
     */
    drawGraph(prefecture, population) {
      let years = [];
      let values = [];
      // グラフ描画のためにデータを配列に保存
      for (let i = 0; i < population.length; i++) {
        years.push(population[i].year);
        values.push(population[i].value);
      }
      this.$set(this.graph.xAxis, "categories", years);
      const graphData = {
        name: prefecture.prefName,
        id: prefecture.prefCode,
        data: values,
        marker: {
          enabled: true,
        },
      };
      this.graph.series.push(graphData);
    },
    /**
     * グラフを削除する
     */
    deleteGraph() {
      let _this = this;
      this.graph.series = this.graph.series.filter(function (series) {
        return series.id != _this.lastChecked;
      });
      this.graph.series.splice();
    },
    /**
     * グラフをすべて削除する
     */
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
