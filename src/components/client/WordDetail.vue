<template>
  <div v-show="data" :style="{ height: contentHeight + 'px' }">
    <div class="title">
      {{ name }}
    </div>
    <br />
    <div>
      <div v-for="(item, index) in translation" :key="'translation' + index">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  props: {
    data: {
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
      name: "",
      translation: [],
    };
  },
  watch: {
    data() {
      this.dataChange();
    },
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
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
      if (this.data.translation) {
        this.translation = this.data.translation;
      }
      if (this.data.name) {
        this.name = this.data.name;
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
