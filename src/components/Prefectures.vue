<template>
  <div>
    <p>選択した都道府県の総人口推移グラフを表示します。</p>
    <div class="frame">
      <div v-for="i in prefectures" :key="i.prefCode" class="checkbox">
        <input
          type="checkbox"
          :id="i.prefCode"
          :value="i"
          v-model="checked"
          @click="lastCheck(i)"
          style="cursor: pointer"
        />
        <label :for="i.prefCode" style="cursor: pointer">{{
          i.prefName
        }}</label>
      </div>
    </div>

    <!-- {{ last }} -->
    <charts @all-clear="allClear()" :checked="checked" :last="last" />
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
      checked: [],
      last: "",
    };
  },
  computed: {
    isCheckedPref() {
      return this.prefectures.filter(function (i) {
        return i.isChecked;
      });
    },
  },
  async mounted() {
    await this.fetchPrefectures();
  },
  methods: {
    async fetchPrefectures() {
      try {
        const res = await axios.get("/api/v1/prefectures");
        this.prefectures = res.data.result;
        console.log(this.prefectures);
      } catch (error) {
        console.log(error);
      }
    },
    lastCheck(i) {
      this.last = i.prefCode;
    },
    allClear() {
      this.checked.splice(0, this.checked.length);
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 600px) {
  .frame {
    max-height: 200px;
  }
}

.frame {
  padding: 0.5em 1em;
  margin: 1em;
  /* border: solid 2px #000000; */
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
