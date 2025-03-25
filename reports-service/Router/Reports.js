const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../Middleware/Auth');

const TASK_SERVICE_URL = 'http://localhost:3005';
const PROJECT_SERVICE_URL = 'http://localhost:3003';

const fetchWithToken = async (url, token) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

router.get('/project-progress', authenticateToken, async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const projects = await fetchWithToken(`${PROJECT_SERVICE_URL}/projects`, token);
    const tasks = await fetchWithToken(`${TASK_SERVICE_URL}/tasks`, token);

    const report = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project._id);
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(t => t.status === 'done').length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        projectId: project._id,
        name: project.name,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        totalTasks,
        completedTasks,
        progress: progress.toFixed(2),
      };
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
});

// User Workload Report
router.get('/user-workload', authenticateToken, async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const tasks = await fetchWithToken(`${TASK_SERVICE_URL}/tasks`, token);
    const workload = {};

    tasks.forEach(task => {
      const userId = task.assignedTo._id; 
      if (!workload[userId]) {
        workload[userId] = {
          userId,
          name: task.assignedTo.name,
          totalTasks: 0,
          byStatus: { 'to-do': 0, 'in-progress': 0, 'done': 0 },
          byPriority: { low: 0, medium: 0, high: 0 },
        };
      }
      workload[userId].totalTasks += 1;
      workload[userId].byStatus[task.status] += 1;
      workload[userId].byPriority[task.priority] += 1;
    });

    res.json(Object.values(workload));
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
});

router.get('/task-priority-distribution', authenticateToken, async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const tasks = await fetchWithToken(`${TASK_SERVICE_URL}/tasks`, token);
    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
    };

    tasks.forEach(task => {
      distribution[task.priority] += 1;
    });

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
});

router.get('/task-user-distribution', authenticateToken, async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const tasks = await fetchWithToken(`${TASK_SERVICE_URL}/tasks`, token);
    const distribution = {};

    tasks.forEach(task => {
      const userId = task.assignedTo._id; 
      distribution[userId] = (distribution[userId] || 0) + 1;
    });

    const result = Object.entries(distribution).map(([userId, count]) => ({
      userId,
      name: tasks.find(t => t.assignedTo._id === userId).assignedTo.name,
      taskCount: count,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
});

module.exports = router;