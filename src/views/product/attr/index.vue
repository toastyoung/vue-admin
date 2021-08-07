<template>
  <div>
    <CategorySelector :disabled="!isShowAttrlist" />
    <Attrlist
      v-if="isShowAttrlist"
      @updateIsShowAttrlist="updateIsShowAttrlist"
    />
    <AddOrUpdate
      v-if="!isShowAttrlist"
      :isShowUpdate="isShowUpdate"
      @updateIsShowAttrlist="updateIsShowAttrlist"
    />
  </div>
</template>

<script>
import CategorySelector from '@/components/CategorySelector'
import AddOrUpdate from './addOrUpdate'
import Attrlist from './attrlist'
export default {
  name: 'Attr',
  components: {
    CategorySelector,
    Attrlist,
    AddOrUpdate
  },
  data() {
    return {
      isShowAttrlist: true,
      isShowUpdate: false
    }
  },

  methods: {
    updateIsShowAttrlist(isShowAttrlist, isShowUpdate) {
      this.isShowAttrlist = isShowAttrlist
      this.isShowUpdate = isShowUpdate
    }
  }
}
</script>

<style>
</style>