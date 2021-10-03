<template>
  <div>
    <Header />
    <div class="home">
      <Prefectures />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Prefectures from "@/components/Prefectures.vue";
export default {
  name: "Home",
  components: {
    Header,
    Prefectures,
  },
};
</script>

<style scoped>
.home {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 20px;
}
</style>
