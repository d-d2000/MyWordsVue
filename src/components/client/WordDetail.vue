<template>
  <div v-show="data" :style="{ height: contentHeight + 'px' }">
    <div class="title">
      {{ name }}
    </div>
    <br />
    <div style="line-height: 28px" v-html="displaytranslation"></div>
    <div v-if="wfs.length > 0" style="line-height: 28px">
      <br />
      <span style="font-weight: 700">词性</span>
      <div v-for="(item, index) in wfs" :key="'wfs' + index">
        {{ item.wf.name + "：" + item.wf.value }}
      </div>
    </div>
    <div v-if="web.length > 0" style="line-height: 28px">
      <br />
      <span style="font-weight: 700">网络释义</span>
      <div v-for="(item, index) in web" :key="'web' + index">
        {{ item.key + "：" + item.value }}
      </div>
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
      web: [],
      wfs: [],
    };
  },
  computed:{
    displaytranslation() {
      return this.translation.split("\n").join("<br/>");
    }
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
        this.translation = "";
        this.name = "";
        return;
      }
      this.translation = this.data.newWordsMean;
      this.name = this.data.newWords;
      this.search();
    },
    search() {
      var appKey = this.youdao.appKey;
      var key = this.youdao.key; //注意：暴露appSecret，有被盗用造成损失的风险
      var salt = new Date().getTime();
      var curtime = Math.round(new Date().getTime() / 1000);
      var query = this.name;
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var typeArr = "en::zh-CHS".split("::");
      var from = typeArr[0];
      var to = typeArr[1];
      var str1 = appKey + truncate(query) + salt + curtime + key;
      //var vocabId = "您的用户词表ID";
      //console.log('---',str1);
      var sign = this.CryptoJS.SHA256(str1).toString(this.CryptoJS.enc.Hex);

      var me = this;
      var args = {
        //strict: true,
        q: query,
        appKey: appKey,
        salt: salt,
        //from: from,
        //to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
        //vocabId: vocabId,
      };
      console.info("args", args);
      this.$axios({
        url: "youdaofanyi",
        params: args,
      }).then(
        (response) => {
          console.log(
            "response.data",
            JSON.parse(JSON.stringify(response.data))
          );

          if (response.data.basic && response.data.basic.explains) {
            this.translation = response.data.basic.explains.join("\n");
          }

          if (response.data.web) {
            this.web = response.data.web;
          }
          if (response.data.basic && response.data.basic.wfs) {
            this.wfs = response.data.basic.wfs;
          }

          return response.data;
        },
        (error) => {
          console.log("错误", error.message);
        }
      );

      function truncate(q) {
        var len = q.length;
        if (len <= 20) return q;
        return q.substring(0, 10) + len + q.substring(len - 10, len);
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
