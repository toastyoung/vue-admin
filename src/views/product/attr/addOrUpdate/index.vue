<template>
  <div>
    <el-card class="container">
      <el-form ref="form" label-width="80" inline :model="attr" :rules="rules">
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName" placeholder="请输入属性名" />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attr.attrName"
        @click="addAttrValue"
      >
        添加属性值
      </el-button>

      <el-table
        v-loading="loading"
        :data="attrValueList"
        border
        class="container-table"
      >
        <el-table-column label="序号" width="50" type="index" align="center" />
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-show="row.isEdit"
              :ref="$index"
              v-model="attr.valueName"
              size="mini"
              placeholder="请输入属性值名称"
              @blur="setAttrValue(row, $index)"
              @keyup.enter.native="$event.target.blur()"
            />
            <span
              v-show="!row.isEdit"
              class="attrValueText"
              @click="showEdit(row, $index)"
            >
              {{ row.valueName }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-button type="text" @click="delAttrValue($index)">
              <el-tooltip content="删除属性值" placement="top">
                <el-button type="danger" icon="el-icon-delete" size="mini" />
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="addAttr">确定</el-button>
      <el-button @click="goBack">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqSaveAttr } from '@/api/product/attr'

export default {
  name: 'AddOrUpdate',
  data() {
    return {
      attrValueList: [],
      loading: false,
      attr: {
        attrName: '',
        valueName: ''
      },
      props: {
        isShowUpdate: {
          type: Boolean
        }
      },
      rules: {
        attrName: [{ required: true, message: '请输入属性名', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('category', ['category3Id'])
  },
  methods: {
    addAttrValue() {
      this.attrValueList.push({
        valueName: '',
        isEdit: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrValueList.length - 1].focus()
      })
    },
    setAttrValue(row, index) {
      const { valueName } = this.attr
      if (!valueName) {
        this.attrValueList.splice(index, 1)
        return
      }

      row.valueName = valueName
      row.isEdit = false

      this.attr.valueName = ''
    },
    showEdit(row, index) {
      row.isEdit = true
      this.attr.valueName = row.valueName
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    delAttrValue(index) {
      this.$confirm('是否删除该属性值?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.attrValueList.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 增加属性
    addAttr() {
      const {
        attrValueList,
        attr: { attrName }
      } = this
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if (!attrValueList.length) {
          this.$message({
            type: 'error',
            message: '请至少添加一个属性值'
          })
          return
        }
        const attr = {
          attrName: attrName,
          attrValueList: attrValueList,
          categoryId: this.category3Id,
          categoryLevel: 3
        }
        await reqSaveAttr(attr)
        this.goBack()
      })
    },
    // 返回
    goBack() {
      this.attrValueList = []
      this.attr = {
        attrName: '',
        valueName: ''
      }
      this.$emit('updateIsShowAttrlist', true)
    }
  }
}
</script>

<style>
.attrValueText {
  display: block;
}
</style>