<template>
  <div>
    <div v-for="i in prefectures" :key="i.prefCode">
      <input
        type="checkbox"
        :id="i.prefCode"
        :value="i.prefCode"
        v-model="checked"
      />
      <label :for="i.prefCode">{{ i.prefName }}</label>
    </div>
    {{ last }}
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Prefectures",
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
        // console.log(res.data.result);
        this.prefectures = res.data.result;
        console.log(this.prefectures);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
