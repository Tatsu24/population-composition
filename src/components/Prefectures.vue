<template>
  <div>
    <span v-for="i in prefectures" :key="i.prefCode">
      <input
        type="checkbox"
        :id="i.prefCode"
        :value="i"
        v-model="checked"
        @click="lastCheck(i)"
      />
      <label :for="i.prefCode">{{ i.prefName }}</label>
    </span>
    <!-- {{ last }} -->
    <composition ref="composition" :checked="checked" :last="last" />
  </div>
</template>

<script>
import axios from "axios";
import composition from "@/components/Composition.vue";
export default {
  name: "Prefectures",
  components: {
    composition,
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
        // console.log(res.data.result);
        this.prefectures = res.data.result;
        // for (let i = 0; i < this.prefectures.length; i++) {
        //   this.$set(this.prefectures[i], "isChecked", false);
        // }
        console.log(this.prefectures);
      } catch (error) {
        console.log(error);
      }
    },
    lastCheck(i) {
      this.last = i.prefCode;
    },
  },
};
</script>
