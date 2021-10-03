<template>
  <div>
    <p>選択した都道府県の総人口推移グラフを表示します。</p>
    <div class="frame">
      <div
        v-for="prefecture in prefectures"
        :key="prefecture.prefCode"
        class="checkbox"
      >
        <input
          type="checkbox"
          :id="prefecture.prefCode"
          :value="prefecture"
          v-model="checkedArray"
          @click="saveLastChecked(prefecture)"
          style="cursor: pointer"
        />
        <label :for="prefecture.prefCode" style="cursor: pointer">{{
          prefecture.prefName
        }}</label>
      </div>
    </div>
    <charts
      @all-clear="allClear()"
      :checkedArray="checkedArray"
      :lastChecked="lastChecked"
    />
  </div>
</template>

<script>
import axios from "axios";
import charts from "@/components/Charts.vue";
export default {
  name: "Prefectures",
  components: {
    charts,
  },
  data() {
    return {
      prefectures: [],
      checkedArray: [],
      lastChecked: "",
    };
  },
  async mounted() {
    await this.fetchPrefectures();
  },
  methods: {
    /**
     * RESAS APIで都道府県一覧を取得する
     */
    async fetchPrefectures() {
      try {
        const res = await axios.get("/api/v1/prefectures");
        this.prefectures = res.data.result;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * 最後にチェックを付けた、または、外した都道府県のprefCodeを格納する
     * @param {Object} prefecture - 都道府県情報（都道府県一覧で取得した都道府県番号と都道府県名）
     */
    saveLastChecked(prefecture) {
      this.lastChecked = prefecture.prefCode;
    },
    /**
     * チェックをすべて外す
     */
    allClear() {
      this.checkedArray.splice(0, this.checkedArray.length);
    },
  },
};
</script>

<style scoped>
/* 画面サイズが599px以下のときは都道府県一覧に高さを設定する */
@media screen and (max-width: 599px) {
  .frame {
    height: 200px;
  }
}
.frame {
  padding: 0.5em 1em;
  margin: 1em;
  background: #f9f9f9;
  overflow-y: auto;
  border-radius: 10px;
}
.checkbox {
  border-radius: 20px;
  display: inline-block;
  padding: 0 5px;
  margin: 0.3em;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px;
  cursor: pointer;
}
</style>
