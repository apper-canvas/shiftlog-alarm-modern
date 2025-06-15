import shifts from '../mockData/shifts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...shifts];

const shiftService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const shift = data.find(item => item.id === id);
    return shift ? { ...shift } : null;
  },

  async create(shift) {
    await delay(400);
    const newShift = {
      ...shift,
      id: Date.now().toString(),
      status: 'scheduled'
    };
    data.push(newShift);
    return { ...newShift };
  },

  async update(id, updates) {
    await delay(350);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Shift not found');
    
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Shift not found');
    
    data.splice(index, 1);
    return true;
  },

  async getUpcoming() {
    await delay(200);
    const today = new Date();
    const upcoming = data
      .filter(shift => new Date(shift.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return [...upcoming];
  }
};

export default shiftService;