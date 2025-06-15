import { toast } from 'react-toastify';

const timeEntryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'clock_in', 'clock_out', 'total_hours', 'status', 'breaks', 'employee_id', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await apperClient.fetchRecords('time_entry', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(entry => ({
        ...entry,
        breaks: entry.breaks ? this.parseBreaks(entry.breaks) : [],
        clockIn: entry.clock_in,
        clockOut: entry.clock_out,
        totalHours: entry.total_hours,
        employeeId: entry.employee_id
      }));
    } catch (error) {
      console.error("Error fetching time entries:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Name', 'clock_in', 'clock_out', 'total_hours', 'status', 'breaks', 'employee_id', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy']
      };
      
      const response = await apperClient.getRecordById('time_entry', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      const entry = response.data;
      return {
        ...entry,
        breaks: entry.breaks ? this.parseBreaks(entry.breaks) : [],
        clockIn: entry.clock_in,
        clockOut: entry.clock_out,
        totalHours: entry.total_hours,
        employeeId: entry.employee_id
      };
    } catch (error) {
      console.error(`Error fetching time entry with ID ${id}:`, error);
      return null;
    }
  },

  async create(entry) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: entry.Name || `Time Entry ${new Date().toISOString()}`,
          clock_in: entry.clockIn || new Date().toISOString(),
          clock_out: entry.clockOut || null,
          total_hours: parseFloat(entry.totalHours || 0),
          status: entry.status || 'active',
          breaks: this.stringifyBreaks(entry.breaks || []),
          employee_id: parseInt(entry.employeeId) || null,
          Tags: entry.Tags || '',
          Owner: entry.Owner
        }]
      };
      
      const response = await apperClient.createRecord('time_entry', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} time entry records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const entry = successfulRecords[0].data;
          return {
            ...entry,
            breaks: entry.breaks ? this.parseBreaks(entry.breaks) : [],
            clockIn: entry.clock_in,
            clockOut: entry.clock_out,
            totalHours: entry.total_hours,
            employeeId: entry.employee_id
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating time entry:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.clockIn !== undefined) updateData.clock_in = updates.clockIn;
      if (updates.clockOut !== undefined) updateData.clock_out = updates.clockOut;
      if (updates.totalHours !== undefined) updateData.total_hours = parseFloat(updates.totalHours);
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.breaks !== undefined) updateData.breaks = this.stringifyBreaks(updates.breaks);
      if (updates.employeeId !== undefined) updateData.employee_id = parseInt(updates.employeeId);
      if (updates.Tags !== undefined) updateData.Tags = updates.Tags;
      if (updates.Owner !== undefined) updateData.Owner = updates.Owner;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('time_entry', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} time entry records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const entry = successfulUpdates[0].data;
          return {
            ...entry,
            breaks: entry.breaks ? this.parseBreaks(entry.breaks) : [],
            clockIn: entry.clock_in,
            clockOut: entry.clock_out,
            totalHours: entry.total_hours,
            employeeId: entry.employee_id
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating time entry:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('time_entry', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results && response.results.length > 0) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} time entry records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting time entry:", error);
      throw error;
    }
  },

  async getCurrentActive() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'clock_in', 'clock_out', 'total_hours', 'status', 'breaks', 'employee_id'],
        where: [
          {
            FieldName: "status",
            Operator: "ExactMatch",
            Values: ["active"]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('time_entry', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return null;
      }
      
      const entry = response.data[0];
      return {
        ...entry,
        breaks: entry.breaks ? this.parseBreaks(entry.breaks) : [],
        clockIn: entry.clock_in,
        clockOut: entry.clock_out,
        totalHours: entry.total_hours,
        employeeId: entry.employee_id
      };
    } catch (error) {
      console.error("Error fetching active time entry:", error);
      return null;
    }
  },

  async clockOut(id) {
    try {
      const entry = await this.getById(id);
      if (!entry) throw new Error('Time entry not found');
      
      const clockOut = new Date();
      const clockIn = new Date(entry.clockIn);
      const totalHours = (clockOut - clockIn) / (1000 * 60 * 60);
      
      const updates = {
        clockOut: clockOut.toISOString(),
        totalHours: Math.round(totalHours * 100) / 100,
        status: 'completed'
      };
      
      return await this.update(id, updates);
    } catch (error) {
      console.error("Error clocking out:", error);
      throw error;
    }
  },

  async startBreak(entryId, breakType = 'unpaid') {
    try {
      const entry = await this.getById(entryId);
      if (!entry) throw new Error('Time entry not found');
      
      const newBreak = {
        startTime: new Date().toISOString(),
        endTime: null,
        type: breakType,
        duration: 0
      };
      
      const updatedBreaks = [...(entry.breaks || []), newBreak];
      
      return await this.update(entryId, { breaks: updatedBreaks });
    } catch (error) {
      console.error("Error starting break:", error);
      throw error;
    }
  },

  async endBreak(entryId) {
    try {
      const entry = await this.getById(entryId);
      if (!entry) throw new Error('Time entry not found');
      
      const breaks = [...(entry.breaks || [])];
      const activeBreakIndex = breaks.findIndex(b => !b.endTime);
      
      if (activeBreakIndex !== -1) {
        const endTime = new Date();
        const startTime = new Date(breaks[activeBreakIndex].startTime);
        const duration = (endTime - startTime) / (1000 * 60 * 60);
        
        breaks[activeBreakIndex] = {
          ...breaks[activeBreakIndex],
          endTime: endTime.toISOString(),
          duration: Math.round(duration * 100) / 100
        };
      }
      
      return await this.update(entryId, { breaks });
    } catch (error) {
      console.error("Error ending break:", error);
      throw error;
    }
  },

  parseBreaks(breaksString) {
    try {
      if (!breaksString || breaksString.trim() === '') return [];
      return JSON.parse(breaksString);
    } catch (error) {
      console.error("Error parsing breaks:", error);
      return [];
    }
  },

  stringifyBreaks(breaksArray) {
    try {
      if (!breaksArray || !Array.isArray(breaksArray)) return '';
      return JSON.stringify(breaksArray);
    } catch (error) {
      console.error("Error stringifying breaks:", error);
      return '';
    }
  }
};

export default timeEntryService;