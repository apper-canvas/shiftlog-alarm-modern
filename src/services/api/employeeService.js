import employees from '../mockData/employees.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...employees];

const employeeService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const employee = data.find(item => item.id === id);
    return employee ? { ...employee } : null;
  },

  async getCurrent() {
    await delay(200);
    // Return the first employee as current user for demo
    return data[0] ? { ...data[0] } : null;
  },

  async create(employee) {
    await delay(400);
    const newEmployee = {
      ...employee,
      id: Date.now().toString()
    };
    data.push(newEmployee);
    return { ...newEmployee };
  },

  async update(id, updates) {
    await delay(350);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    data.splice(index, 1);
    return true;
  }
};

export default employeeService;