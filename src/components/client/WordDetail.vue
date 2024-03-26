<template>
  <div v-show="data" :style="{ height: contentHeight + 'px' }">
    <div class="title">
      {{ name }}
    </div>
    <br />
    <div>
      {{ translation }}
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  props: {
    origin_data: {
      type: Object,
      default: null,
    },
    windowHeight: {
      type: Number,
    },
    windowWidth: {
      type: Number,
    },
  },
  data() {
    return {
      contentHeight: 0,
      data: null,
      name: "",
      translation: "",
    };
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
    this.data = this.origin_data;
    this.dataChange();
  },
  mounted() {},
  methods: {
    dataChange() {
      if (!this.data) {
        this.translation = [];
        this.name = "";
        return;
      }
      console.log("data", JSON.parse(JSON.stringify(this.data)));
      if (this.data.newWordsMean) {
        this.translation = this.data.newWordsMean;
      }
      if (this.data.newWords) {
        this.name = this.data.newWords;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  cursor: pointer;
  font-size: 30px;
}
</style>
