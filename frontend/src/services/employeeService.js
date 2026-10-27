import api from './api';

export const employeeService = {
  async getEmployees(params = {}) {
    const response = await api.get('/employees', { params });
    return response.data.data;
  },

  async getEmployeeById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  async createEmployee(employeeData) {
    const response = await api.post('/employees', employeeData);
    return response.data.data;
  },

  async updateEmployee(id, employeeData) {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/employees/${id}/status`, { status });
    return response.data.data;
  },

  async toggleActive(id) {
    const response = await api.patch(`/employees/${id}/active`);
    return response.data.data;
  },

  async deleteEmployee(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};
