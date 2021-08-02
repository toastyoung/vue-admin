<template>
  <el-card class="container">
    <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="$emit('updateIsShowAttrlist',false)">添加属性</el-button>
    <el-table
      :data="attrList"
      border
      class="container-table"
      v-loading="loading"
    >
      <el-table-column label="序号" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column prop="attrName" label="属性名"> </el-table-column>
      <el-table-column label="属性值列表">
        <template v-slot="{ row }">
          <el-tag
            class="attr-tag"
            v-for="attrValue in row.attrValueList"
            :key="attrValue.id"
          >
            {{ attrValue.valueName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-tooltip content="修改属性" placement="top">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除属性" placement="top">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { reqGetAttrList } from "@/api/product/attr";

export default {
  name: "Attrlist",
  data() {
    return {
      attrList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState("category", ["category1Id", "category2Id", "category3Id"]),
  },
  watch: {
    category3Id: {
      async handler(category3Id) {
        if (!category3Id) return;
        const { category1Id, category2Id } = this;
        const attrList = await reqGetAttrList({
          category1Id,
          category2Id,
          category3Id,
        });
        this.attrList = attrList;
      },
    },
  },
};
</script>

<style>
</style>