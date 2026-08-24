import { createJobSchema } from "../zodSchema/jobSchem.js";
import { prisma } from "../db_init.js";
import { getCache, setCache, deleteCache } from "../services/redis.js";
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
        const key = `job:${req.user_id}`;
        const cacheData = await getCache(key);
        if (cacheData) {
            // already parsing it in getCache function
            return res.status(200).json({
                cacheData
            });
        }
        const jobs = await prisma.job.findMany({
            where: {
                userId: Number(req.user_id)
            }
        });
        if (!jobs) {
            return res.status(500).json({
                message: "couldnt fetch jobs"
            });
        }
        await setCache(key, jobs, 120);
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