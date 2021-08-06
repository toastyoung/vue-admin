<template>
  <el-card class="container">
    <el-table
      :data="skuList"
      border
      class="container-table"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>

      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row }">
          <img
            :src="row.skuDefaultImg"
            :alt="row.skuName"
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"></el-table-column>
      <el-table-column prop="price" label="价格(元)"></el-table-column>
      <el-table-column width="300" label="操作">
        <template v-slot="{ row }">
          <el-button
            :type="row.isSale ? 'info' : 'success'"
            size="mini"
            :icon="[`el-icon-${row.isSale ? 'bottom' : 'top'}`]"
            >{{ row.isSale ? "下架" : "上架" }}</el-button
          >
          <el-button type="warning" size="mini" icon="el-icon-edit"
            >修改</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, total, sizes"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { reqGetSkuList } from "@/api/product/sku";
export default {
  name: "Sku",
  data() {
    return {
      loading: false,
      skuList: [{}],
      pageSize: 10,
      currentPage: 1,
      total: 0,
    };
  },
  methods: {
    async getSkuList(currentPage, pageSize) {
      const res = await reqGetSkuList(currentPage, pageSize);
      this.skuList = res.records;
      this.total = res.total;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSkuList(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getSkuList(currentPage, this.pageSize);
    },
  },
  mounted() {
    this.getSkuList(this.currentPage, this.pageSize);
  },
};
</script>

<style>
</style>