import { createJobSchema } from "../zodSchema/jobSchem.js";
import { prisma } from "../db_init.js";
import client from "../services/redis.js";
export const createJob = async (req, res) => {
    try {
        const parsedData = createJobSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.issues
            });
        }
        const userId = Number(req.user_id);
        const { companyName, role, referral, remote } = parsedData.data;
        const newJob = await prisma.job.create({
            data: {
                userId: userId,
                companyName: companyName,
                role: role,
                referral: referral,
                remote: remote
            }
        });
        if (!newJob) {
            return res.status(500).json({
                message: "couldnt create this entry in database"
            });
        }
        return res.status(201).json({
            newJob
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "couldnt create this entry in database"
        });
    }
};
export const getJobs = async (req, res) => {
    try {
        await client.set("vansh", "chauhan");
        const data = await client.get("vansh");
        console.log(data);
        const jobs = await prisma.job.findMany({
            where: {
                userId: Number(req.user_id)
            }
        });
        console.log(jobs);
        if (!jobs) {
            return res.status(500).json({
                message: "couldnt fetch jobs"
            });
        }
        return res.status(200).json({
            jobs
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "couldnt fetch jobs"
        });
    }
};
//# sourceMappingURL=job.controller.js.map