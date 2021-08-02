<template>
  <el-card class="container">
    <el-button type="primary" @click="showSaveTrademark">添加品牌</el-button>

    <el-table
      :data="trademarkList"
      border
      class="container-table"
      v-loading="loading"
    >
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img class="trademark-img" :src="row.logoUrl" :alt="row.tmName" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="showUpdateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,total, sizes"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      :title="`${isUpdateTrademark ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
    >
      <el-form ref="form" :model="trademark" label-width="100px" :rules="rules">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademark.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${baseApi}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept="image/jpeg,image/png"
          >
            <img
              v-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  reqGetTrademarkList,
  reqSaveTrademark,
  reqRemoveTrademark,
  reqUpdateTrademark,
} from "@/api/product/trademark";

export default {
  name: "Trademark",
  mounted() {
    this.getTrademarkList(this.currentPage, this.pageSize);
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 3,
      total: 100,
      trademarkList: [],
      loading: false,
      visible: false,
      trademark: {
        tmName: "",
        logoUrl: "",
      },
      baseApi: process.env.VUE_APP_BASE_API,
      // 表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请上传品牌LOGO", trigger: "change" },
        ],
      },
      isUpdateTrademark: false,
    };
  },
  methods: {
    async getTrademarkList(currentPage, pageSize) {
      this.loading = true;
      const res = await reqGetTrademarkList(currentPage, pageSize);
      this.trademarkList = res.records;
      this.total = res.total;
      this.loading = false;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getTrademarkList(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getTrademarkList(currentPage, this.pageSize);
    },
    // 上传成功
    handleAvatarSuccess(res) {
      this.trademark.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.$refs.form.clearValidate(["logoUrl"]);
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const validFileType = ["image/jpeg", "image/jpg", "image/png"];
      const isValidFileType = validFileType.indexOf(file.type) > -1;
      const isLt2M = file.size / 1024 < 500;

      if (!isValidFileType) {
        this.$message.error("上传头像图片只能是 JPG/JPEG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 500kb!");
      }
      return isValidFileType && isLt2M;
    },
    // 添加品牌
    addOrUpdateTrademark() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { tmName, logoUrl } = this.trademark;
          const { isUpdateTrademark } = this;
          if (isUpdateTrademark) {
            await reqUpdateTrademark(this.trademark);
          } else {
            await reqSaveTrademark(tmName, logoUrl);
          }

          this.$message({
            type: "success",
            message: `${isUpdateTrademark ? "修改" : "添加"}品牌成功`,
          });
          this.getTrademarkList(this.currentPage, this.pageSize);
          this.visible = false;
        }
      });
    },
    // 添加品牌对话框
    showSaveTrademark() {
      this.isUpdateTrademark = false;
      this.visible = true;
      // 清空表单
      this.$refs.form?.resetFields();
      this.trademark = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 修改品牌对话框
    showUpdateTrademark(row) {
      this.isUpdateTrademark = true;
      this.visible = true;
      this.trademark = { ...row };
    },
    // 删除品牌
    delTrademark(tm) {
      this.$confirm(
        `您确定要删除<span style="color:red;">${tm.tmName}</span>品牌数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      ).then(async () => {
        // 删除
        await reqRemoveTrademark(tm.id);

        this.$message({
          type: "success",
          message: "删除成功!",
        });

        // 最后一页删除最后一条，去上一页
        if (this.trademarkList.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }

        // 更新页面数据
        this.getTrademarkList(this.currentPage, this.pageSize);
      });
    },
  },
};
</script>

<style lang="sass">
.trademark-img
  width: 100px
  height: 100px

.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
  &:hover
    border-color: #409EFF

  .avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  .avatar
    width: 178px
    height: 178px
    display: block
</style>