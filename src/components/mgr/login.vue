<template>
  <div>
    <el-dialog title="登录" :visible="true">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="form.userPwd"
            autocomplete="off"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  props: {},
  data() {
    return {
      form: {
        userName: "",
        userPwd: "",
      },
      formLabelWidth: "120px",
    };
  },
  created() {},
  mounted() {},
  methods: {
    submit() {
      var args = {
        userName: this.form.userName,
        pwd: this.form.userPwd,
      };
      //console.info("提交", args);
      this.$axios({
        url: "myServer/yipai/userInfo/mgrLogin",
        params: args,
      }).then(
        (response) => {
          //console.log("response", response);
          if (!response.data.success) {
            this.$message({
              message: response.data.msg,
              type: "warning",
            });
            return;
          } else {
            this.$message({
              message: response.data.msg,
              type: 'success'
            });
          }
          localStorage.setItem("mgruser", JSON.stringify(response.data.data));
          this.$router.push({
            path: "/mgr",
          });

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
<style lang="scss" scoped></style>
