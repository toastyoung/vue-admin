<template>
  <el-card class="container">
    <el-form :model="spu" label-width="80px" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="SPU品牌" prop="tmId">
        <el-select v-model="spu.tmId" placeholder="请选择SPU品牌">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          v-model="spu.description"
          :rows="2"
          placeholder="请输入SPU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片" prop="spuImageList">
        <el-upload
          :action="`${baseApi}/admin/product/fileUpload`"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept="image/jpeg,image/png"
          :class="{ 'spu-img-upload': spu.spuImageList.length >= 9 }"
        >
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select placeholder="请选择销售属性">
          <el-option :label="111" :value="111"></el-option>
          <el-option :label="222" :value="222"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性值</el-button>

        <el-table :data="spuSaleAttrList" border class="container-table">
          <el-table-column type="index" align="center" label="序号" width="50">
          </el-table-column>

          <el-table-column label="属性名" width="100"> </el-table-column>
          <el-table-column label="属性值列表"> </el-table-column>
          <el-table-column label="操作" width="100">
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
      </el-form-item>

      <el-form-item>
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { reqGetAllTrademark } from "@/api/product/trademark";
import { reqGetBaseSaleAttrList } from "@/api/product/spu";

export default {
  name: "AddOrUpdate",
  data() {
    return {
      spu: {
        spuName: "", //名称
        tmId: "", //品牌
        description: "", //描述
        spuImageList: [], //图片
        spuSaleAttrList: [], //销售属性
      },
      rules: {
        spuName: [
          { required: true, message: "请输入SPU名称", trigger: "blur" },
        ],
        tmId: [{ required: true, message: "请选择SPU品牌", trigger: "blur" }],
        description: [
          { required: true, message: "请输入SPU描述", trigger: "blur" },
        ],
        spuImageList: [
          { required: true, message: "请上传SPU图片", trigger: "blur" },
        ],
        spuSaleAttrList: [
          { required: true, message: "请选择销售属性", trigger: "blur" },
        ],
      },
      trademarkList: [],
      baseSaleAttrList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      baseApi: process.env.VUE_APP_BASE_API,
    };
  },
  async mounted() {
    const res = await Promise.allSettled([
      reqGetAllTrademark(),
      reqGetBaseSaleAttrList(),
    ]);
    console.log(res);
  },
  methods: {
    // 删除图片数据
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spu.spuImageList = this.spu.spuImageList.filter((img) => {
        img.imgUrl !== file.response.data;
      });
    },
    // 预览放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.spu.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data,
      });

      // this.$refs.form.clearValidate(["logoUrl"]);
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
  },
};
</script>

<style>
</style>