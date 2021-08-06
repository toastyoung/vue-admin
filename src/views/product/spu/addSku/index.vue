<template>
  <el-card class="container">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input-number
          placeholder="请输入价格"
          v-model="sku.price"
          controls-position="right"
          :min="0"
          class="add-sku-inputNumber"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="重量">
        <el-input-number
          v-model="sku.weight"
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
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-row>
          <el-col
            v-for="(attr, index) in attrList"
            :key="attr.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            class="add-sku-col"
          >
            <el-form-item :label="attr.attrName">
              <el-select
                placeholder="请选择平台属性值"
                v-model="sku.skuAttrValueList[index]"
              >
                <el-option
                  :label="attrValue.valueName"
                  :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
                  v-for="(attrValue, index) in attr.attrValueList"
                  :key="attrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-row>
          <el-col
            v-for="(saleAttr, index) in spu.spuSaleAttrList"
            :key="saleAttr.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            class="add-sku-col"
          >
            <el-form-item :label="saleAttr.saleAttrName">
              <el-select
                placeholder="请选择销售属性值"
                v-model="sku.skuSaleAttrValueList[index]"
              >
                <el-option
                  v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                  :label="saleAttrValue.saleAttrValueName"
                  :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}`"
                  :key="saleAttrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="SKU图片">
        <el-table
          :data="spuImageList"
          border
          class="container-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="50" type="selection" align="center">
          </el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row }">
              <img :src="row.imgUrl" :alt="row.imgName" class="sku-img" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-show="row.isDefault === '0'"
                @click="setDefaultImage(row)"
                >设置默认图片</el-button
              >
              <el-button
                type="success"
                size="mini"
                v-show="row.isDefault === '1'"
                disabled
                >默认图片</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="submit">确认</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { reqGetAttrList } from "@/api/product/attr";
import { reqGeSpuImageList, reqGetSpuInfo } from "@/api/product/spu";
import { reqSaveSkuInfo } from "@/api/product/sku";

export default {
  name: "AddSku",
  data() {
    return {
      spu: {},
      spuImageList: [],
      sku: {
        price: 0, //价格
        weight: 0, //重量
        skuName: "",
        skuDesc: "", //描述
        //平台属性列表
        skuAttrValueList: [
          //     {
          //       "attrId": 0,
          //       "attrName": "string",
          //       "valueId": 0,
          //       "valueName": "string"
          //     }
        ],
        skuDefaultImg: "", // 默认图片
        // 选中图片列表
        skuImageList: [
          //     {
          //       "imgName": "string",
          //       "imgUrl": "string",
          //       "isDefault": "string",
          //     }
        ],
        // 销售属性列表
        skuSaleAttrValueList: [
          //     {
          //       "saleAttrId": 0,
          //       "saleAttrName": "string",
          //       "saleAttrValueId": 0,
          //       "saleAttrValueName": "string",
          //     }
        ],
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
    const [spuImageListRes, spuInfoRes, attrListReq] = await Promise.allSettled(
      [
        reqGeSpuImageList(spuId),
        reqGetSpuInfo(spuId),
        reqGetAttrList({
          category1Id,
          category2Id,
          category3Id,
        }),
      ]
    );
    if (spuImageListRes.status === "fulfilled") {
      this.spuImageList = spuImageListRes.value.map((spuImage) => {
        return {
          ...spuImage,
          isDefault: "0",
        };
      });
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
  methods: {
    // 手机图片数据
    handleSelectionChange(val) {
      this.sku.skuImageList = val;
    },
    // 设置默认图片
    setDefaultImage(row) {
      this.sku.skuImageList.forEach((skuImage) => {
        skuImage.isDefault = "0";
      });
      row.isDefault = "1";
    },
    // 返回spu列表页面
    cancel() {
      this.$emit("updateIsShow", 1);
    },
    // 提交SKU
    async submit() {
      const { category3Id, spuId } = this;
      console.log(category3Id);
      const {
        price,
        weight,
        skuName,
        skuDesc,
        skuAttrValueList,
        skuImageList,
        skuSaleAttrValueList,
      } = this.sku;
      const data = {
        category3Id,
        spuId,
        price,
        weight,
        skuName,
        skuDesc,
        // 默认图片
        skuDefaultImg: skuImageList.find((img) => img.isDefault === "1").imgUrl,

        // filter(Boolean) 清除空数据
        skuAttrValueList: skuAttrValueList.filter(Boolean).map((attr) => {
          const [attrId, attrName, valueId, valueName] = attr.split(":");
          return {
            attrId,
            attrName,
            valueId,
            valueName,
          };
        }),
        skuSaleAttrValueList: skuSaleAttrValueList
          .filter(Boolean)
          .map((saleAttr) => {
            const [
              saleAttrId,
              saleAttrName,
              saleAttrValueId,
              saleAttrValueName,
            ] = saleAttr.split(":");
            return {
              saleAttrId,
              saleAttrName,
              saleAttrValueId,
              saleAttrValueName,
            };
          }),
      };
      console.log(data);
      await reqSaveSkuInfo(data);

      this.$message({
        type: "success",
        message: "添加SKU成功",
      });

      this.cancel();
    },
  },
};
</script>

<style>
.add-sku-inputNumber {
  width: 100%;
}
.sku-img {
  width: 150px;
  height: 150px;
}
.add-sku-col {
  margin-bottom: 10px;
}
</style>