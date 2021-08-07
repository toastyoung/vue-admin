<template>
  <div>
    <CategorySelector :disabled="isShow !== 1" />
    <SpuList v-if="isShow === 1" @updateIsShow="updateIsShow" />
    <AddOrUpdate v-if="isShow === 2" @updateIsShow="updateIsShow" />
    <AddSku v-if="isShow === 3" @updateIsShow="updateIsShow" />
  </div>
</template>

<script>
import AddOrUpdate from './addOrUpdate'
import CategorySelector from '@/components/CategorySelector'
import SpuList from './spuList'
import AddSku from './addSku'

export default {
  name: 'Spu',
  components: {
    CategorySelector,
    SpuList,
    AddOrUpdate,
    AddSku
  },
  data() {
    return {
      // 1:spu列表  2:增/改SPU   3：增/改SKU
      isShow: 1
    }
  },
  methods: {
    updateIsShow(isShow) {
      this.isShow = isShow
    }
  }
}
</script>

<style>
</style>