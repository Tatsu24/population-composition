<template>
  <div style="max-width: 700px; margin: 0 auto">
    <h1>都道府県別の総人口推移グラフ</h1>
    <Prefectures />
  </div>
</template>

<script>
import Prefectures from "@/components/Prefectures.vue";
export default {
  name: "Home",
  components: {
    Prefectures,
  },
  mounted() {},
  methods: {},
};
</script>
