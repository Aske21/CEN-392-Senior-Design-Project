import AxiosClient from "@/lib/axios/axiosClient";

class AdminApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async getUsers(page = 1, limit = 20) {
    try {
      const url = `/admin/users?page=${page}&limit=${limit}`;
      return (await this.instance.get(url)) as any;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(id: number) {
    try {
      return await this.instance.delete(`/admin/users/${id}`);
    } catch (error) {
      throw error;
    }
  }

  public async updateUserRole(id: number, role: string) {
    try {
      return await this.instance.put(`/admin/users/${id}/role`, { role });
    } catch (error) {
      throw error;
    }
  }

  public async getOrders(page = 1, limit = 20) {
    try {
      const url = `/admin/orders?page=${page}&limit=${limit}`;
      return (await this.instance.get(url)) as any;
    } catch (error) {
      throw error;
    }
  }

  public async updateOrderStatus(id: number, status: string) {
    try {
      return await this.instance.put(`/admin/orders/${id}/status`, { status });
    } catch (error) {
      throw error;
    }
  }
}

const adminApi = new AdminApi();
export default adminApi;
