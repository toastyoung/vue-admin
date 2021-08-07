<template>
  <el-card class="container">
    <el-form ref="form" :model="spu" label-width="80px" :rules="rules">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spu.spuName" placeholder="请输入SPU名称" />
      </el-form-item>

      <el-form-item label="SPU品牌" prop="tmId">
        <el-select v-model="spu.tmId" placeholder="请选择SPU品牌">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" prop="description">
        <el-input
          v-model="spu.description"
          type="textarea"
          :rows="2"
          placeholder="请输入SPU描述"
        />
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
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <!-- eslint-disable-next-line -->
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性" prop="spuSaleAttrList">
        <el-select
          v-model="baseSaleAttr"
          :placeholder="`还剩${baseSaleAttrList.length}个销售属性`"
        >
          <el-option
            v-for="saleAttr in baseSaleAttrList"
            :key="saleAttr.id"
            :value="`${saleAttr.id}:${saleAttr.name}`"
            :label="saleAttr.name"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!baseSaleAttr"
          @click="addSaleAttr"
        >
          添加销售属性值
        </el-button>

        <el-table :data="spu.spuSaleAttrList" border class="container-table">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="50"
          />

          <el-table-column prop="saleAttrName" label="属性名" width="100" />
          <el-table-column label="属性值列表">
            <template v-slot="{ row, $index }">
              <el-tag
                v-for="(saleValue, index) in row.spuSaleAttrValueList"
                :key="saleValue.saleAttrValueName"
                class="spu-tag"
                closable
                @close="delSaleValue(row.spuSaleAttrValueList, index)"
              >
                {{ saleValue.saleAttrValueName }}
              </el-tag>
              <el-button
                v-show="!row.isEdit"
                size="mini"
                icon="el-icon-plus"
                @click="showEdit(row, $index)"
              >
                添加属性值
              </el-button>
              <el-input
                v-show="row.isEdit"
                :ref="$index"
                v-model="attrValue"
                class="spu-sale-ipt"
                size="mini"
                placeholder="请输入属性值"
                @blur="setAttrValue(row)"
                @keyup.enter.native="$event.target.blur"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template v-slot="{ row, $index }">
              <el-tooltip
                slot="reference"
                content="删除销售属性"
                placement="top"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSaleAttr(row, $index)"
                >
                  删除
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { reqGetAllTrademark } from '@/api/product/trademark'
import { reqGetBaseSaleAttrList, reqSaveSpu } from '@/api/product/spu'
import { mapState } from 'vuex'

export default {
  name: 'AddOrUpdate',
  data() {
    const validator = (rule, value, callback) => {
      /*
        rule 规则名称 包含字段
        value 校验值的情况
        callback 必须要调用
          callback() 通过
          callback(xxx) 失败
      */
      //  销售属性
      if (!this.spu.spuSaleAttrList.length) {
        callback('请至少添加一个销售属性')
        return
      }
      //  销售属性值
      const hasSpuSaleAttrValueList = this.spu.spuSaleAttrList.every(
        (saleAttr) => {
          return !!saleAttr.spuSaleAttrValueList.length
        }
      )

      if (!hasSpuSaleAttrValueList) {
        callback('每个销售属性都要至少添加一个属性值')
        return
      }

      callback()
    }

    return {
      spu: {
        spuName: '', // 名称
        tmId: '', //  品牌
        description: '', // 描述
        spuImageList: [], //  图片
        spuSaleAttrList: [] //  销售属性
      },
      rules: {
        spuName: [
          { required: true, message: '请输入SPU名称', trigger: 'blur' }
        ],
        tmId: [{ required: true, message: '请选择SPU品牌', trigger: 'change' }],
        description: [
          { required: true, message: '请输入SPU描述', trigger: 'blur' }
        ],
        spuImageList: [{ required: true, message: '请上传SPU图片' }],
        spuSaleAttrList: [
          { required: true, validator: validator, trigger: 'blur' }
        ]
      },
      trademarkList: [],
      baseSaleAttrList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      baseApi: process.env.VUE_APP_BASE_API,
      baseSaleAttr: '', //  选中的销售属性
      attrValue: '' //  输入添加销售属性的值
    }
  },
  computed: {
    ...mapState('category', ['category3Id'])
  },
  async mounted() {
    const [trademarkListRes, baseSaleAttrListRes] = await Promise.allSettled([
      reqGetAllTrademark(),
      reqGetBaseSaleAttrList()
    ])
    // 获取品牌数据
    if (trademarkListRes.status === 'fulfilled') {
      this.trademarkList = trademarkListRes.value
    } else {
      this.$message({
        type: 'error',
        message: '获取品牌数据失败'
      })
    }
    // 获取销售属性
    if (baseSaleAttrListRes.status === 'fulfilled') {
      this.baseSaleAttrList = baseSaleAttrListRes.value
    } else {
      this.$message({
        type: 'error',
        message: '获取销售属性数据失败'
      })
    }
  },
  methods: {
    // 删除图片数据
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.spu.spuImageList = this.spu.spuImageList.filter((img) => {
        img.imgUrl !== file.response.data
      })
    },
    // 预览放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.spu.spuImageList.push({
        imgName: file.name,
        imgUrl: res.data
      })

      this.$refs.form.clearValidate(['spuImageList'])
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const validFileType = ['image/jpeg', 'image/jpg', 'image/png']
      const isValidFileType = validFileType.indexOf(file.type) > -1
      const isLt2M = file.size / 1024 < 500

      if (!isValidFileType) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
      }
      return isValidFileType && isLt2M
    },
    // 增加销售属性
    addSaleAttr() {
      // 增加销售属性
      const [baseSaleAttrId, saleAttrName] = this.baseSaleAttr.split(':')
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      })
      // 删除已添加
      this.baseSaleAttrList = this.baseSaleAttrList.filter(
        (saleAttr) => saleAttr.id !== +baseSaleAttrId
      )
      // 清空选中的值
      this.baseSaleAttr = ''
    },
    // 删除销售属性
    delSaleAttr(row, index) {
      this.spu.spuSaleAttrList.splice(index, 1)
      this.baseSaleAttrList.push({
        id: +row.baseSaleAttrId,
        name: row.saleAttrName
      })
      this.baseSaleAttrList.sort((a, b) => a.id - b.id)
    },
    // 编辑模式
    showEdit(row, index) {
      this.$set(row, 'isEdit', true)
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 设置属性值
    setAttrValue(row) {
      const { attrValue } = this
      if (attrValue) {
        row.spuSaleAttrValueList.push({
          saleAttrValueName: attrValue,
          baseSaleAttrId: +row.baseSaleAttrId,
          saleAttrName: row.saleAttrName
        })

        this.attrValue = ''
      }
      row.isEdit = false
    },
    // 删除属性值
    delSaleValue(saleAttrValueList, index) {
      saleAttrValueList.splice(index, 1)
    },
    // 保存SPU
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { category3Id } = this
          const { description, spuImageList, spuName, spuSaleAttrList, tmId } =
            this.spu
          const data = {
            category3Id,
            description,
            spuImageList,
            spuName,
            spuSaleAttrList,
            tmId
          }
          await reqSaveSpu(data)

          this.$message({
            type: 'success',
            message: '添加SPU成功'
          })

          this.cancel()
        }
      })
    },
    // 返回列表页面
    cancel() {
      this.$emit('updateIsShow', 1)
    }
  }
}
</script>

<style>
.spu-sale-ipt {
  width: 150px;
}
.spu-tag {
  margin-right: 10px;
}
</style>