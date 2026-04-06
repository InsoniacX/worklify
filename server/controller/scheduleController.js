import Schedule from "../model/scheduleModel.js";

export const fetchMySchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find({ user: req.user.id })
            .sort({ date: 1 });
        
        res.status(200).json(schedules);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const fetchScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: "Schedule not Found" })
        res.status(200).json(schedule); 
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
}

export const createSchedule = async (req, res) => {
    try {
        const { title, description, date, startTime, endTime, type, team } = req.body;

        if (!title || !date || !startTime || !endTime ) {
            return res.status(400).json({ message: "Title, Date, Start Time, and End Time are Required" });
        }

        const schedule = new Schedule({
            title,
            description,
            date,
            startTime,
            endTime,
            type,
            team,
            user: req.user.id,
        });

        const saved = await schedule.save();
        res.status(201).json(saved);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: "Schedule not Found" });

        const updated = await Schedule.findByIdAndUpdate( 
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.status(200).json(updated);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: "Schedule not Found" });
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Schedule has been Deleted" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}