<template>
  <el-tabs v-model="editableTabsValue" type="card" @edit="handleTabsEdit">
    <el-tab-pane label="查询" name="1">
      <div :style="{ height: contentHeight + 'px' }">
        <div style="width: 700px; margin: 0 auto; padding: 100px 0 50px 0">
          <el-input
            placeholder="请输入内容"
            v-model="searchText"
            class="myinput"
          >
            <el-select
              style="width: 140px"
              v-model="type"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="英文 > 中文" value="en::zh-CHS"></el-option>
              <el-option label="中文 > 英文" value="zh-CHS::en"></el-option>
            </el-select>
            <el-button
              @click="search"
              style="width: 150px"
              slot="append"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-input>
        </div>
        <el-button @click="addTab">添加到Tab页</el-button>
        <el-button>添加到生词本</el-button>
        <div style="width:700px">
          <div>{{word ? word.name : ""}}</div>
          <br>
          <div>{{word ? word.translation : ""}}</div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane
      :key="'WordDetail' + index"
      v-for="(item, index) in editableTabs"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
      <component
        :windowHeight="windowHeight"
        :windowWidth="windowWidth"
        v-show="item.name == editableTabsValue"
        :is="item.content"
        :origin_data="item.args.data"
      ></component>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
// @ is an alias to /src
import WordDetail from "./WordDetail.vue";
import CryptoJS from "crypto-js";

export default {
  components: {
    WordDetail: WordDetail,
  },
  props: {
    windowHeight: {
      type: Number,
    },
    windowWidth: {
      type: Number,
    },
  },
  data() {
    return {
      searchText: "",
      type: "en::zh-CHS",
      keyText: "",
      word: null,
      contentHeight: 0,
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 2,
    };
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
  },
  mounted() {},
  methods: {
    search() {
      this.word = null;

      this.keyText = this.searchText;
      var appKey = "695964bc75e4efd0";
      var key = "h8fw78HDfrYxJVVlJwvPsF9fqkttehRK"; //注意：暴露appSecret，有被盗用造成损失的风险
      var salt = new Date().getTime();
      var curtime = Math.round(new Date().getTime() / 1000);
      var query = this.keyText;
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var typeArr = this.type.split("::");
      var from = typeArr[0];
      var to = typeArr[1];
      var str1 = appKey + truncate(query) + salt + curtime + key;
      //var vocabId = "您的用户词表ID";
      //console.log('---',str1);
      var sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

      var me = this;
      var args = {
        strict: true,
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
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

          if (!response.data.isWord) {
            this.$message({
              message: "无法查询到该词",
              type: "warning",
            });
            return;
          }
          if (response.data.translation[0] == response.data.query) {
            response.data.isNoTrans = true;
            this.$message({
              message: "请切换翻译模式",
              type: "warning",
            });
            return;
          }
          var word = {};

          if (response.data.basic) {
            word.translation = response.data.basic.explains;
          }
          if (response.data.query) {
            word.name = response.data.query;
          }

          me.word = word;
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
    addTab() {
      if (!this.word) return;
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: this.word.name + "-详情",
        name: newTabName,
        content: "WordDetail",
        closable: true,
        args: { data: this.word },
      });
      this.editableTabsValue = newTabName;
    },
    handleTabsEdit(targetName, action) {
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);

        if (this.editableTabs.length == 0) {
          this.editableTabsValue = "1";
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
