<template>
  <el-tabs v-model="editableTabsValue" type="card" @edit="handleTabsEdit">
    <el-tab-pane label="单词查询" name="1">
      <div :style="{ height: contentHeight + 'px' }">
        <div style="width: 700px; margin: 0 auto; padding: 100px 0 50px 0">
          <el-input
            @input="handleInput"
            placeholder="请输入英文单词"
            v-model="searchText"
            class="myinput"
          >
            <el-button
              @click="search"
              style="width: 150px"
              slot="append"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-input>
        </div>
        <div style="width: 1000px; margin: 0 auto">
          <el-row>
            <!-- <el-button @click="addTab">添加到Tab页</el-button> -->
            <el-button v-show="word" @click="see">查看详情</el-button>
            <el-button
              v-show="word && userName"
              :disabled="disabledAddNewWord"
              @click="addNewWord"
              >添加到生词本</el-button
            >
          </el-row>
          <!-- <br />
          <div>{{ word ? word.name : "" }}</div> -->
          <br />
          <div v-show="word">
            <div style="font-weight: bold">中文释义：</div>
            <br />
            <div v-html="means"></div>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="翻译" name="2">
      <div :style="{ height: contentHeight + 'px' }">
        <div style="width: 700px; margin: 0 auto; padding: 100px 0 50px 0">
          <el-input
            placeholder="请输入句子"
            v-model="searchText2"
            class="myinput"
          >
            <el-button
              @click="search2"
              style="width: 150px"
              slot="append"
              icon="el-icon-search"
              >翻译</el-button
            >
          </el-input>
        </div>
        <div style="width: 1000px; margin: 0 auto">
          <!-- <div>{{ word2 ? word2.name : "" }}</div> -->
          <br />
          <div v-show="word2">
            <div style="font-weight: bold">中文释义：</div>
            <br />
            <div v-html="means2"></div>
          </div>
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

export default {
  components: {
    WordDetail: WordDetail,
  },
  props: {
    userName: {
      type: String,
      default: "",
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
      disabledAddNewWord: false,
      searchText: "",
      searchText2: "",
      keyText: "",
      word: null,
      word2: null,
      contentHeight: 0,
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 3,
    };
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
  },
  computed: {
    means() {
      if (this.word) return this.word.translation.split("\n").join("<br/>");
      else return "";
    },
    means2() {
      if (this.word2) return this.word2.translation.split("\n").join("<br/>");
      else return "";
    },
  },
  mounted() {},
  methods: {
    handleInput() {
      this.searchText = this.searchText.replace(/[^A-Za-z]/g, "");
    },
    addNewHistory() {
      if (!this.userName) return;
      var args = {
        historyWord: this.word.name,
        historyMean: this.word.translation,
      };
      //console.info("提交历史记录", args);
      this.$axios({
        url: "myServer/yipai/historyInfo/add",
        params: args,
      }).then(
        (response) => {
          //console.log("response", response);
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );
    },
    addNewWord() {
      if (!this.userName) return;
      if (!this.word) return;
      var args = {
        newWords: this.word.name,
        newWordsMean: this.word.translation,
        wordsState: false,
      };
      //console.info("提交", args);
      this.$axios({
        url: "myServer/yipai/wordsInfo/add",
        params: args,
      }).then(
        (response) => {
          //console.log("response", response);
          this.$message({
            message: response.data.msg,
            type: "success",
          });
          if (!response.data.success) {
            return;
          }
          this.disabledAddNewWord = true;
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );
    },
    change() {
      this.search();
    },
    change2() {
      this.search2();
    },
    search() {
      if (!this.searchText) return;
      this.word = null;

      var appKey = this.youdao.appKey;
      var key = this.youdao.key; //注意：暴露appSecret，有被盗用造成损失的风险
      var salt = new Date().getTime();
      var curtime = Math.round(new Date().getTime() / 1000);
      var query = this.searchText;
      var to = "zh-CHS";
      var str1 = appKey + truncate(query) + salt + curtime + key;
      //var vocabId = "您的用户词表ID";
      ////console.log('---',str1);
      var sign = this.CryptoJS.SHA256(str1).toString(this.CryptoJS.enc.Hex);

      var me = this;
      var args = {
        strict: true,
        q: query,
        appKey: appKey,
        salt: salt,
        from: "en",
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
        //vocabId: vocabId,
      };
      //console.info("args", args);
      this.$axios({
        url: "youdaofanyi",
        params: args,
      }).then(
        (response) => {
          //   if (
          //     !response.data.isWord ||
          //     !response.data.basic ||
          //     !response.data.basic.explains
          //   ) {
          //     this.$message({
          //       message: "无法查询到该单词",
          //       type: "warning",
          //     });
          //     return;
          //   }
          var word = {};
          if (response.data.translation) {
            word.translation = response.data.translation[0];
          }
          //   if (response.data.basic && response.data.basic.explains) {
          //     word.translation = response.data.basic.explains.join("\n");
          //   }
          //word.translation = response.data.translation.join("\n");
          word.name = response.data.query;

          me.word = word;
          this.addNewHistory();
          this.disabledAddNewWord = false;
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );

      function truncate(q) {
        var len = q.length;
        if (len <= 20) return q;
        return q.substring(0, 10) + len + q.substring(len - 10, len);
      }
    },
    search2() {
      if (!this.searchText2) return;
      this.word2 = null;

      var appKey = this.youdao.appKey;
      var key = this.youdao.key; //注意：暴露appSecret，有被盗用造成损失的风险
      var salt = new Date().getTime();
      var curtime = Math.round(new Date().getTime() / 1000);
      var query = this.searchText2;
      var to = "zh-CHS";
      var str1 = appKey + truncate(query) + salt + curtime + key;
      //var vocabId = "您的用户词表ID";
      ////console.log('---',str1);
      var sign = this.CryptoJS.SHA256(str1).toString(this.CryptoJS.enc.Hex);

      var me = this;
      var args = {
        strict: true,
        q: query,
        appKey: appKey,
        salt: salt,
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
        //vocabId: vocabId,
      };
      //console.info("args", args);
      this.$axios({
        url: "youdaofanyi",
        params: args,
      }).then(
        (response) => {
          var word = {};
          word.translation = response.data.translation.join("\n");
          word.name = response.data.query;

          me.word2 = word;
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );

      function truncate(q) {
        var len = q.length;
        if (len <= 20) return q;
        return q.substring(0, 10) + len + q.substring(len - 10, len);
      }
    },
    see() {
      var obj = {
        newWords: this.word.name,
        newWordsMean: this.word.translation,
      };
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: this.word.name + "-详情",
        name: newTabName,
        content: "WordDetail",
        closable: true,
        args: { data: obj },
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
