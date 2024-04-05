<template>
  <div>
    <div>
      <el-table
        ref="tableBox"
        :height="contentHeight - 32"
        :data="tableData"
        stripe
      >
        <el-table-column type="index" label="编号" width="60">
        </el-table-column>
        <el-table-column prop="newWords" label="单词"> </el-table-column>
        <el-table-column prop="newWordsMean" label="释义" width="500">
        </el-table-column>
        <el-table-column prop="wordsState" label="单词记住状态">
          <template slot-scope="scope">
            {{ scope.row.wordsState ? "已记住" : "未记住" }}</template
          >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作" width="200">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      contentHeight: 0,
      tableData: [],
      currentPage: 1,
      total: 0,
      pageSize: 20,
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
    };
  },
  computed: {},
  created() {
    this.contentHeight = this.windowHeight - 80;
    this.loadData();
  },
  mounted() {},
  methods: {
    del(row) {
      var args = JSON.parse(JSON.stringify(row));
      //console.info("提交", args);
      this.$axios({
        url: "myServer/yipai/wordsInfo/delete",
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
        url: "myServer/yipai/wordsInfo/getWords",
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
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
