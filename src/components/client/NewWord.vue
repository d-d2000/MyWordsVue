<template>
  <el-tabs v-model="editableTabsValue" type="card" @edit="handleTabsEdit">
    <el-tab-pane label="生词列表" name="1">
      <div>
        <el-table
          ref="tableBox"
          :height="contentHeight - 32"
          :data="tableData"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column prop="uid" label="生词编号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small" v-if="scope.row.type == 1"
                >禁用</el-button
              >
              <el-button type="text" size="small" v-if="scope.row.type == 0"
                >解禁</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
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
        :data="item.args.data"
      ></component>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import WordDetail from "./WordDetail.vue";
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
      contentHeight: 0,
      editableTabsValue: "1",
      editableTabs: [],
      tabIndex: 2,
      tableData: [],
    };
  },
  computed: {},
  created() {
    this.contentHeight = this.windowHeight - 155;
    for (let i = 1; i <= 200; i++) {
      this.tableData.push({ uid: i, name: "单词" + i });
    }
  },
  mounted() {},
  methods: {
    cellClick(row, column, cell, event) {
      // console.info(row, column, cell, event);
      if (column.property == "name") {
        this.addTab(row);
      }
    },
    addTab(row) {
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: row.name + "-详情",
        name: newTabName,
        content: "WordDetail",
        closable: true,
        args: { data: row },
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
