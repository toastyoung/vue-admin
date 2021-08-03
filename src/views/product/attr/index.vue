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
    };
  },
  components: {
    CategorySelector,
    Attrlist,
    AddOrUpdate,
  },
  methods: {
    updateIsShowAttrlist(isShowAttrlist) {
      this.isShowAttrlist = isShowAttrlist;
    },
  },
};
</script>

<style>
</style>