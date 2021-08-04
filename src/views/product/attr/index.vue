<template>
  <div>
    <CategorySelector :disabled="!isShowAttrlist" />
    <Attrlist
      v-if="isShowAttrlist"
      @updateIsShowAttrlist="updateIsShowAttrlist"

    />
    <AddOrUpdate
      v-if="!isShowAttrlist"
      @updateIsShowAttrlist="updateIsShowAttrlist"
      :isShowUpdate="isShowUpdate"
    />
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector";
import AddOrUpdate from "./addOrUpdate";
import Attrlist from "./attrlist";
export default {
  name: "Attr",
  data() {
    return {
      isShowAttrlist: true,
      isShowUpdate: false,
    };
  },
  components: {
    CategorySelector,
    Attrlist,
    AddOrUpdate,
  },
  methods: {
    updateIsShowAttrlist(isShowAttrlist,isShowUpdate) {
      this.isShowAttrlist = isShowAttrlist;
      this.isShowUpdate = isShowUpdate
    },
  },
};
</script>

<style>
</style>