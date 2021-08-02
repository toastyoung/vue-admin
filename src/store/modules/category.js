import {
  reqGetCategory1List,
  reqGetCategory2List,
  reqGetCategory3List
} from "@/api/product/category";

const state = {
  category1Id: "",
  category2Id: "",
  category3Id: "",
  category1List: [],
  category2List: [],
  category3List: []
};

const actions = {
  // 请求一级分类
  async getCategory1List({ commit }) {
    const category1List = await reqGetCategory1List();
    commit("GET_CATEGORY1_LIST", category1List);
  },
  // 请求二级分类
  async getCategory2List({ commit }, category1Id) {
    const category2List = await reqGetCategory2List(category1Id);
    commit("GET_CATEGORY2_LIST", { category2List, category1Id });
  },
  // 请求三级分类
  async getCategory3List({ commit }, category2Id) {
    const category3List = await reqGetCategory3List(category2Id);
    commit("GET_CATEGORY3_LIST", { category3List, category2Id });
  }
};

const mutations = {
  GET_CATEGORY1_LIST(state, category1List) {
    state.category1List = category1List;
  },

  GET_CATEGORY2_LIST(state, { category2List, category1Id }) {
    state.category2List = category2List;
    state.category1Id = category1Id;
    // 清空后面数据
    state.category2Id = "";
    state.category3Id = "";
    state.category3List = [];
  },

  GET_CATEGORY3_LIST(state, { category3List, category2Id }) {
    state.category3List = category3List;
    state.category2Id = category2Id;
    // 清空后面数据
    state.category3Id = "";
  },

  // 更新3id
  SET_CATEGORY3_ID(state, category3Id) {
    state.category3Id = category3Id;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
