<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-input placeholder="用户名"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button>清空</el-button>
    </el-form>
    <div class="add-del-user">
      <el-button type="primary">添&nbsp;加</el-button>
      <el-button type="danger" disabled>批量删除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="users"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用户名" width="80" />
      <el-table-column label="用户昵称" width="80" />
      <el-table-column label="权限列表" />
      <el-table-column label="创建时间" width="155" />
      <el-table-column label="更新时间" width="155" />
      <el-table-column label="操作" width="200" align="center">
        <el-button
          type="info"
          size="mini"
          icon="el-icon-user-solid"
        ></el-button>
        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :currentPage="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :pageSize="pageSize"
      layout="total, sizes, prev, pager, jumper, next"
      :total="total"
    />
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      users: [{}],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style>
.add-del-user {
  margin-bottom: 20px;
}
</style>