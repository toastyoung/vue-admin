<template>
  <el-card class="container">
    <el-form inline :disabled="disabled">
      <el-form-item label="一级分类" class="category-form-item">
        <el-select
          :value="category1Id"
          placeholder="请选择"
          @change="getCategory2List"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" class="category-form-item">
        <el-select
          :value="category2Id"
          placeholder="请选择"
          @change="getCategory3List"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" class="category-form-item">
        <el-select
          :value="category3Id"
          placeholder="请选择"
          @change="SET_CATEGORY3_ID"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "CategorySelector",
  mounted() {
    // 请求一级分类
    this.getCategory1List();
  },
  computed: {
    ...mapState("category", [
      "category1Id",
      "category2Id",
      "category3Id",
      "category1List",
      "category2List",
      "category3List",
    ]),
  },
  methods: {
    ...mapActions("category", [
      "getCategory1List",
      "getCategory2List",
      "getCategory3List",
    ]),
    ...mapMutations("category", ["SET_CATEGORY3_ID"]),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.category-form-item {
  margin: 10px 0;
}
</style>