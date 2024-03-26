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
        <el-table-column prop="userName" label="账号"> </el-table-column>
        <el-table-column prop="userPwd" label="密码"> </el-table-column>
        <el-table-column prop="userState" label="用户状态">
          <template slot-scope="scope">
            {{ scope.row.userState ? "正常" : "封禁中" }}</template
          >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="update(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.userState"
              >禁用</el-button
            >
            <el-button
              @click="update(scope.row)"
              type="text"
              size="small"
              v-if="!scope.row.userState"
              >启用</el-button
            >
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
      console.info("提交", args);
      this.$axios({
        url: "myServer/yipai/userInfo/delete",
        params: args,
      }).then(
        (response) => {
          console.log("response", response);
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
          console.log("错误", error.message);
        }
      );
    },
    handleCurrentChange() {
      this.loadData();
    },
    update(row) {
      var args = JSON.parse(JSON.stringify(row));
      args.userState = !args.userState;
      console.info("提交修改", args);
      this.$axios({
        url: "myServer/yipai/userInfo/update",
        params: args,
      }).then(
        (response) => {
          console.log("response", response);
          this.$message({
            message: response.data.msg,
            type: "success",
          });
          if (!response.data.success) {
            return;
          }
          row.userState = !row.userState;
          return response.data;
        },
        (error) => {
          console.log("错误", error.message);
        }
      );
    },
    loadData() {
      var args = {
        start: this.currentPage,
        limit: this.pageSize,
      };
      console.info("查询", args);
      this.$axios({
        url: "myServer/yipai/userInfo/getAllUser",
        params: args,
      }).then(
        (response) => {
          console.log("response", response);
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
          console.log("错误", error.message);
        }
      );
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
