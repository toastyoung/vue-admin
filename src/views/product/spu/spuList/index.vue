<template>
  <el-card class="container">
    <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id"
      >添加SPU</el-button
    >
    <el-table
      :data="spuList"
      border
      class="container-table"
      v-loading="loading"
    >
      <el-table-column label="序号" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-tooltip content="添加SKU" placement="top">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="修改SKU" placement="top">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="查看SKU列表" placement="top">
            <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          </el-tooltip>

          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            class="spu-list-confirm"
          >
            <el-tooltip content="删除SPU" placement="top" slot="reference">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
          </el-popconfirm>
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
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { reqGetSpuList } from "@/api/product/spu";
export default {
  name: "SpuList",
  data() {
    return {
      loading: false,
      spuList: [],
      currentPage: 1,
      pageSize: 3,
      total: 0,
    };
  },
  computed: {
    ...mapState("category", ["category3Id"]),
  },
  methods: {
    // 获取spu列表
    async getSpuList() {
      const { category3Id, currentPage, pageSize } = this;
      this.loading = true;
      const res = await reqGetSpuList({
        category3Id,
        page: currentPage,
        limit: pageSize,
      });
      this.loading = false;
      this.spuList = res.records;
      this.total = res.total;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSpuList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSpuList();
    },
  },
  watch: {
    category3Id: {
      handler(category3Id) {
        if (!category3Id) {
          // 重置数据
          this.spuList = [];
          this.total = 0;
          this.currentPage = 1;
          this.pageSize = 3;
          return;
        }
        this.getSpuList();
      },
      immediate: true,
    },
  },
};
</script>

<style>
.spu-list-confirm {
  margin-left: 10px;
}
</style>