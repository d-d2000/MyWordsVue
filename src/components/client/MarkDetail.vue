<template>
  <div v-show="data">
    <div v-show="action != 'view'" :style="{ height: contentHeight + 'px' }">
      <el-row type="flex" justify="end" style="margin-bottom: 10px">
        <el-button
          type="danger"
          icon="el-icon-close"
          circle
          @click="cancel"
        ></el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          @click="save"
        ></el-button>
      </el-row>
      <el-input
        type="textarea"
        placeholder="请输入"
        v-model="notepadInfo"
        resize="none"
        rows="12"
      >
      </el-input>
    </div>

    <div :style="{ height: contentHeight + 'px' }" v-show="action == 'view'">
      <el-row type="flex" justify="end" style="margin-bottom: 10px">
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="edit"
        ></el-button>
      </el-row>
      <div :style="{ height: contentHeight - 50 + 'px' }">
        {{ notepadInfo }}
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  props: {
    origin_action: {
      type: String,
      default: "view",
    },
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
      action: "view",
      data: null,
      notepadInfo: "",
    };
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
    this.action = this.origin_action;
    this.data = this.origin_data;
    this.dataChange();
  },
  mounted() {},
  methods: {
    cancel() {
      this.$confirm("是否取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.action = "view";
          this.notepadInfo = this.data.notepadInfo;
        })
        .catch(() => {});
    },
    edit() {
      this.action = "update";
    },
    save() {
      this.action = "view";
      this.data.notepadInfo = this.notepadInfo;
    },
    dataChange() {
      console.info("this.data", this.data);
      if (!this.data) {
        this.notepadInfo = "";
        return;
      }
      this.notepadInfo = this.data.notepadInfo;
    },
  },
};
</script>
<style lang="scss" scoped></style>
