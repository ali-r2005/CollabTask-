const express = require("express");
const router = express.Router();

const projectModel = require("../Model/ProjectModel"); 
const {authenticateToken} = require("../Middleware/Auth")
const axios = require("axios")

// Get Project (name, Sdate, Edate, status)
router.get("/", authenticateToken, async (req, res) => {    
    try {
        let filter = {};
        
        if (req.query.name)
            filter.name = req.query.name;
        if (req.query.start_date)
            filter.startDate = req.query.start_date;
        if (req.query.end_date)
            filter.endDate = req.query.end_date;
        if (req.query.status) 
            filter.status = req.query.status;

        const projects = await projectModel.find(filter);
        if (!projects) 
            return res.status(404).json({ message: 'Project not found' });

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create
router.post("/", authenticateToken, async(req, res)=> {
    try {        
        const response = await axios.get(`http://localhost:3001/auth/user/${req.user.id}`, {
            headers: { 
                'Authorization': req.header('Authorization')
            }
        })

        const user = response.data;
        const project = new projectModel({
          name: req.body.name,
          description: req.body.description,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          status: req.body.status || 'active',
          categories: req.body.categories || [],
          createdBy: { 
                _id: user._id,
                name: user.name },
        });
        await project.save();
        res.status(201).json(project);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
})

// Update
router.put("/:id", authenticateToken, async(req, res)=> {
    try {
        const project = await projectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.createdBy._id !== req.user.id && req.user.role !== 'admin')
        {
          return res.status(403).json({ message: 'Unauthorized' });
        }
    
        const updatedProject = await projectModel.findByIdAndUpdate(
          req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true}
        );

        res.json(updatedProject);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
})

// Delete
router.delete("/:id", authenticateToken, async(req, res)=> {
    try{
       await projectModel.findByIdAndDelete(req.params.id)
    }
    catch(err){
        res.json(err.message)
    }
})

// add Category to Project
router.post('/:id/categories', authenticateToken, async (req, res) => {
    try {
        const project = await projectModel.findById(req.params.id);

        if (!project) 
            return res.status(404).json({ message: 'Project not found' });

        if (project.createdBy._id !== req.user.id && req.user.role !== 'admin') 
            return res.status(403).json({ message: 'Unauthorized' });

        project.categories.push(req.body.category);
        await project.save();

        res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});


module.exports = router
