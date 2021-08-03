<template>
  <div>
    <CategorySelector />
    <SpuList v-show="false" />
    <AddOrUpdate />
  </div>
</template>

<script>
import AddOrUpdate from "./addOrUpdate";
import CategorySelector from "@/components/CategorySelector";
import SpuList from "./spuList";

export default {
  name: "Spu",
  components: {
    CategorySelector,
    SpuList,
    AddOrUpdate,
  },
};
</script>

<style>
</style>