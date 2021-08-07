<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-input v-model="searchObj.username" placeholder="用户名" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="search">
        查询
      </el-button>
      <el-button @click="resetSearch">清空</el-button>
    </el-form>
    <div class="add-del-user">
      <el-button type="primary">添&nbsp;加</el-button>
      <el-button type="danger" disabled>批量删除</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="users"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column prop="username" label="用户名" width="80" />
      <el-table-column prop="nickName" label="用户昵称" width="80" />
      <el-table-column prop="roleName" label="权限列表" />
      <el-table-column prop="gmtCreate" label="创建时间" width="155" />
      <el-table-column prop="gmtModified" label="更新时间" width="155" />
      <el-table-column label="操作" width="200" align="center">
        <el-button type="info" size="mini" icon="el-icon-user-solid" />
        <el-button type="primary" size="mini" icon="el-icon-edit" />
        <el-button type="danger" size="mini" icon="el-icon-delete" />
      </el-table-column>
    </el-table>

    <el-pagination
      :currentPage="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :pageSize="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, jumper, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      // nickName:"101010"
      // password:"b45cffe084dd3d20d928bee85e7b0f21"
      // roleName:"admin"
      // salt:"string"
      // token:"string"
      // username:"101010"

      users: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchObj: {
        username: ''
      },
      loading: false
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      this.loading = true
      const res = await this.$API.user.getPageList(
        this.currentPage,
        this.pageSize,
        this.searchObj
      )
      this.users = res.items
      this.total = res.total
      this.loading = false
    },
    // 搜索功能
    search() {
      this.getUsers()
    },
    // 清空搜索
    resetSearch() {
      this.searchObj.username = ''
      this.getUsers()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getUsers()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getUsers()
    },
    handleSelectionChange() {}
  }
}
</script>

<style>
.add-del-user {
  margin-bottom: 20px;
}
</style>