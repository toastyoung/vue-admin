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
      <el-button type="primary" @click="showaddOrUpdate">添&nbsp;加</el-button>
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
        <template v-slot="{ row }">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="showUserRole(row)"
          />
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="showUpdateUser(row)"
          />
          <el-popconfirm
            :title="`确定删除${row.username}吗?`"
            @onConfirm="removeUser(row.id)"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
            />
          </el-popconfirm>
        </template>
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

    <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="isShowUser"
    >
      <el-form
        ref="userForm"
        :model="user"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="isShowRole">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username" />
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>

          <el-checkbox-group
            v-model="userRoleIds"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in allRolesList"
              :label="role.id"
              :key="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item align="right">
          <el-button type="primary" @click="saveUserRoles">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      users: [], //  用户列表
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchObj: {
        username: ''
      },
      loading: false,
      isShowUser: false,
      isShowRole: false,
      isIndeterminate: false, //  是否存在选中
      checkAll: false,
      user: {}, // 当前要操作的user
      userRules: {
        // 添加/修改用户表单校验规则
        username: [
          { required: true, message: '请输入用户名' },
          { min: 4, message: '用户名不得少于4位' }
        ],
        password: [{ required: true, validator: this.validatePassword }]
      },
      // assignRoles: [], //  用户所拥有角色权限
      allRolesList: [], //  所用角色权限
      userRoleIds: [] //  存放用户所拥有角色权限ID
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers(currentPage) {
      this.loading = true
      const res = await this.$API.user.getPageList(
        currentPage ? currentPage : this.currentPage,
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
    handleSelectionChange() {},
    // 自定义密码校验
    validatePassword(rule, value, callback) {
      if (!value) {
        callback('请输入密码')
      } else if (value.length < 6) {
        callback('密码不得少于6位')
      }
      callback()
    },
    // 展示新增用户界面
    showaddOrUpdate() {
      this.user = {}
      this.isShowUser = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    // 展示修改用户界面
    showUpdateUser(row) {
      this.user = { ...row }
      this.isShowUser = true
    },
    // 新增/修改
    addOrUpdate() {
      const { user, currentPage } = this
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          await this.$API.user[user.id ? 'updateUser' : 'addUser'](user).then(
            (result) => {
              this.loading = false
              this.$message.success('保存成功!')
              this.getUsers(user.id ? currentPage : 1)
              this.user = {}
              this.isShowUser = false
            }
          )
        }
      })
    },
    // 删除用户
    async removeUser(id) {
      await this.$API.user.removeUserId(id)
      this.$message.success('删除成功')
      this.getUsers(
        this.users.length === 1 ? this.currentPage - 1 : this.currentPage
      )
    },
    // 取消
    cancel() {
      this.isShowUser = false
      this.isShowRole = false
      this.user = {}
    },
    // 根据用户得到其角色权限列表
    async getRoles(userId) {
      const res = await this.$API.user.getRoles(userId)
      const { allRolesList, assignRoles } = res
      this.allRolesList = allRolesList
      // this.assignRoles = assignRoles
      this.userRoleIds = assignRoles.map((role) => role.id)
      this.checkAll = assignRoles.length === allRolesList.length
      this.isIndeterminate =
        assignRoles.length > 0 && assignRoles.length < allRolesList.length
    },
    // 设置角色界面
    showUserRole(user) {
      this.isShowRole = true
      this.user = user
      this.getRoles(user.id)
    },
    // 控制全选
    handleCheckAllChange() {
      this.isIndeterminate = false
      this.userRoleIds = this.checkAll
        ? this.allRolesList.map((role) => role.id)
        : []
    },
    // 角色列表选中项发生改变
    handleCheckedChange() {
      this.checkAll = this.userRoleIds.length === this.allRolesList.length
      this.isIndeterminate =
        this.userRoleIds.length > 0 &&
        this.userRoleIds.length < this.allRolesList.length
    },
    // 给角色设置权限
    async saveUserRoles() {
      const userId = this.user.id
      const roleId = this.userRoleIds.join(',')
      this.loading = true
      await this.$API.user.assignRoles(userId, roleId)
      this.loading = false
      this.$message.success('保存成功')
      this.cancel()
      this.getUsers()
    }
  }
}
</script>

<style>
.add-del-user {
  margin-bottom: 20px;
}
</style>