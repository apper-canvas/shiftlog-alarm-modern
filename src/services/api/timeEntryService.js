import timeEntries from '../mockData/timeEntries.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...timeEntries];

const timeEntryService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const entry = data.find(item => item.id === id);
    return entry ? { ...entry } : null;
  },

  async create(entry) {
    await delay(400);
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      totalHours: 0,
      status: 'active'
    };
    data.push(newEntry);
    return { ...newEntry };
  },

  async update(id, updates) {
    await delay(350);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Time entry not found');
    
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Time entry not found');
    
    data.splice(index, 1);
    return true;
  },

  async getCurrentActive() {
    await delay(200);
    const active = data.find(entry => entry.status === 'active');
    return active ? { ...active } : null;
  },

  async clockOut(id) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Time entry not found');
    
    const clockOut = new Date();
    const clockIn = new Date(data[index].clockIn);
    const totalHours = (clockOut - clockIn) / (1000 * 60 * 60);
    
    data[index] = {
      ...data[index],
      clockOut: clockOut.toISOString(),
      totalHours: Math.round(totalHours * 100) / 100,
      status: 'completed'
    };
    
    return { ...data[index] };
  },

  async startBreak(entryId, breakType = 'unpaid') {
    await delay(250);
    const index = data.findIndex(item => item.id === entryId);
    if (index === -1) throw new Error('Time entry not found');
    
    const newBreak = {
      startTime: new Date().toISOString(),
      endTime: null,
      type: breakType,
      duration: 0
    };
    
    data[index].breaks.push(newBreak);
    return { ...data[index] };
  },

  async endBreak(entryId) {
    await delay(250);
    const index = data.findIndex(item => item.id === entryId);
    if (index === -1) throw new Error('Time entry not found');
    
    const entry = data[index];
    const activeBreak = entry.breaks.find(b => !b.endTime);
    
    if (activeBreak) {
      const endTime = new Date();
      const startTime = new Date(activeBreak.startTime);
      const duration = (endTime - startTime) / (1000 * 60 * 60);
      
      activeBreak.endTime = endTime.toISOString();
      activeBreak.duration = Math.round(duration * 100) / 100;
    }
    
    return { ...data[index] };
  }
};

export default timeEntryService;