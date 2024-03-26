<template>
  <div>
    <el-table ref="tableBox" :height="tableHeight" :data="tableData" stripe>
      <el-table-column prop="uid" label="编号" width="100"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column label="用户类型" width="150">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.type == 2"
            >管理员用户</span
          >
          <span style="margin-left: 10px" v-else>普通用户</span>
        </template>
      </el-table-column>
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
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableHeight: 0,
    };
  },
  computed: {},
  created() {
    for (let i = 1; i <= 200; i++) {
      this.tableData.push({ uid: i });
    }
  },
  mounted() {
    this.beginShowing();
    // 监听浏览器窗口大小变化
    window.onresize = () => {
      this.beginShowing();
    };
  },
  methods: {
    beginShowing() {
      this.$nextTick(function () {
        // 文档显示区域的高度 - 表格距离浏览器顶部的距离 - 表格距离浏览器底部的距离
        if (this.$refs.tableBox && this.$refs.tableBox.$el.offsetTop) {
          this.tableHeight =
            window.innerHeight - this.$refs.tableBox.$el.offsetTop - 42;
          this.$refs.tableBox.doLayout();
        }
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
