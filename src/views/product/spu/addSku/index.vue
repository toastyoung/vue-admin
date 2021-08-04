<template>
  <el-card class="container">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input-number
          placeholder="请输入价格"
          v-model="spu.price"
          controls-position="right"
          :min="0"
          class="add-sku-inputNumber"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量">
        <el-input-number
          v-model="spu.weight"
          placeholder="请输入重量"
          controls-position="right"
          :min="0"
          class="add-sku-inputNumber"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="SKU描述">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入SKU描述"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form-item
          v-for="(attr, index) in attrList"
          :key="attr.id"
          :label="attr.attrName"
        >
          <el-select placeholder="请选择平台属性值">
            <el-option
              :label="attrValue.valueName"
              :value="111"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form-item
          v-for="(saleAttr, index) in spu.spuSaleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select placeholder="请选择销售属性值">
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :label="saleAttrValue.saleAttrValueName"
              :value="111"
            
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="SKU图片">
        <el-table :data="[{}]" border class="container-table">
          <el-table-column width="50" type="selection" align="center">
          </el-table-column>
          <el-table-column label="图片"> </el-table-column>
          <el-table-column label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button type="primary" size="mini">默认图片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini">确认</el-button>
        <el-button size="mini">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { reqGetAttrList } from "@/api/product/attr";
import { reqGeSpuImageList, reqGetSpuInfo } from "@/api/product/spu";

export default {
  name: "AddSku",
  data() {
    return {
      spuImageList: [],
      spu: {
        price: 0,
        weight: 0,
      },
      attrList: [],
    };
  },
  computed: {
    ...mapState("category", ["category1Id", "category2Id", "category3Id"]),
    ...mapState("spu", ["spuId"]),
  },
  async mounted() {
    const { spuId, category1Id, category2Id, category3Id } = this;
    console.log(category1Id, category2Id, category3Id);
    const [spuImageListRes, spuInfoRes, attrListReq] = await Promise.allSettled(
      [
        reqGeSpuImageList(spuId),
        reqGetSpuInfo(spuId),
        reqGetAttrList({
          category1Id: 9,
          category2Id: 58,
          category3Id: 569,
        }),
      ]
    );
    if (spuImageListRes.status === "fulfilled") {
      this.spuImageList = spuImageListRes.value;
    } else {
      this.$message({
        type: "error",
        message: "获取SPU图片列表数据失败",
      });
    }

    if (spuInfoRes.status === "fulfilled") {
      this.spu = spuInfoRes.value;
    } else {
      this.$message({
        type: "error",
        message: "获取SPU数据失败",
      });
    }

    if (attrListReq.status === "fulfilled") {
      this.attrList = attrListReq.value;
    } else {
      this.$message({
        type: "error",
        message: "获取平台属性列表数据失败",
      });
    }
  },
};
</script>

<style>
.add-sku-inputNumber {
  width: 100%;
}
</style>