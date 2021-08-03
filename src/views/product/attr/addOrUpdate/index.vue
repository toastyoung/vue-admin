<template>
  <div>
    <el-card class="container">
      <el-form label-width="80" inline :model="attr" :rules="rules">
        <el-form-item label="属性名" prop="attrName">
          <el-input placeholder="请输入属性名" v-model="attr.attrName" />
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!attr.attrName"
        @click="addAttrValue"
        >添加属性值</el-button
      >

      <el-table
        :data="attrValueList"
        border
        class="container-table"
        v-loading="loading"
      >
        <el-table-column label="序号" width="50" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              :ref="$index"
              size="mini"
              placeholder="请输入属性值名称"
              v-model="attr.valueName"
              @blur="setAttrValue(row, $index)"
              @keyup.enter.native="$event.target.blur()"
              v-show="row.isEdit"
            ></el-input>
            <span
              class="attrValueText"
              v-show="!row.isEdit"
              @click="showEdit(row, $index)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-tooltip content="删除属性值" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">确定</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AddOrUpdate",
  data() {
    return {
      attrValueList: [],
      loading: false,
      attr: {
        attrName: "",
        valueName: "",
      },
      rules: {
        attrName: [
          { required: true, message: "请输入属性名", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    addAttrValue() {
      this.attrValueList.push({
        valueName: "",
        isEdit: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrValueList.length - 1].focus();
      });
    },
    setAttrValue(row, index) {
      const { valueName } = this.attr;
      if (!valueName) {
        this.attrValueList.splice(index, 1);
        return;
      }

      row.valueName = valueName;
      row.isEdit = false;

      this.attr.valueName = "";
    },
    showEdit(row, index) {
      row.isEdit = true;
      this.attr.valueName = row.valueName;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
  },
};
</script>

<style>
.attrValueText {
  display: block;
}
</style>