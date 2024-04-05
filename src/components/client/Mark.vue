<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    @edit="handleTabsEdit"
    addable
  >
    <el-tab-pane label="笔记列表" name="1">
      <div>
        <el-table
          ref="tableBox"
          :height="contentHeight - 32"
          :data="tableData"
          stripe
          @cell-click="cellClick"
        >
          <el-table-column type="index" label="编号" width="60">
          </el-table-column>
          <el-table-column prop="notepadInfo" label="内容">
            <template slot-scope="scope">
              <a href="#">{{ scope.row.notepadInfo }}</a></template
            >
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="del(scope.row)" type="text" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        >
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
        :origin_data="item.args.data"
        :origin_action="item.args.action"
      ></component>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import MarkDetail from "./MarkDetail.vue";
export default {
  components: {
    MarkDetail: MarkDetail,
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
      currentPage: 1,
      total: 0,
      pageSize: 20,
    };
  },
  computed: {},
  created() {
    this.contentHeight = this.windowHeight - 155;
    this.loadData();
  },
  mounted() {},
  methods: {
    del(row) {
      var args = JSON.parse(JSON.stringify(row));
      //console.info("提交", args);
      this.$axios({
        url: "myServer/yipai/notepadInfo/delete",
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
          this.loadData();
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );
    },
    cellClick(row, column, cell, event) {
      // //console.info(row, column, cell, event);
      if (column.property == "notepadInfo") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: row.notepadInfo.substring(0,10),
          name: newTabName,
          content: "MarkDetail",
          closable: true,
          args: { data: row, action: "view" },
        });
        this.editableTabsValue = newTabName;
      }
    },
    handleCurrentChange() {
      this.loadData();
    },
    loadData() {
      var args = {
        start: this.currentPage,
        limit: this.pageSize,
      };
      //console.info("查询", args);
      this.$axios({
        url: "myServer/yipai/notepadInfo/getNotepad",
        params: args,
      }).then(
        (response) => {
          //console.log("response", response);
          if (!response.data.success) {
            this.$message({
              message: response.data.msg,
              type: "success",
            });
            return;
          }
          this.tableData = response.data.data.records;
          this.total = response.data.data.total;
          return response.data;
        },
        (error) => {
          //console.log("错误", error.message);
        }
      );
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let row = { notepadInfo: "新笔记" };
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: row.notepadInfo,
          name: newTabName,
          content: "MarkDetail",
          closable: true,
          args: { data: row, action: "add" },
        });
        this.editableTabsValue = newTabName;
      }
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
