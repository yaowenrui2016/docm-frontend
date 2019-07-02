import axios from 'axios';

export default {

  /**
   * 获取首页列表页数据
   * @returns {Promise.<*>}
   */
  async login(param: any) {
    return await axios.post('http://localhost:60101/user/login', param).then((res) => res.data.data);
  }
}