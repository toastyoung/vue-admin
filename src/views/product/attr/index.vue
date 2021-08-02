<template>
  <div>
    <CategorySelector :disabled="!isShowAttrlist" />
    <Attrlist
      v-show="isShowAttrlist"
      @updateIsShowAttrlist="updateIsShowAttrlist"
    />
    <AddOrUpdate v-show="!isShowAttrlist" />
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
      isShowAttrlist: false,
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