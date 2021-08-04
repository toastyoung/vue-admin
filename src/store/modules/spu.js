const state = {
  spuId: 1704
};

const mutations = {
  SET_SPU_ID: (state, spuId) => {
    state.spuId = spuId;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
