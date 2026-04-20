import bcrypt from "bcrypt";
import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { Request } from "express";
import { AppError } from "../../utils/app_error";
import sendMail from "../../utils/mail_sender";
import { daily_ai_request_model } from "../analytics/analytics.schema";
import { Account_Model } from "../auth/auth.schema";
import { ClinicalCaseModel } from "../clinical_case/clinical_case.schema";
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { mentor_model } from "../mentor/mentor.schema";
import { osce_model } from "../osce/osce.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { Student_Model } from "../student/student.schema";
import { Admin_Model } from "./admin.schema";

const get_all_overview_data_from_db_fro_admin = async (req: Request) => {
    // Define date ranges
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const today = formatDate(new Date());
    const yesterday = formatDate(subDays(new Date(), 1));

    // Get counts
    const [
        totalStudents,
        totalMentors,
        currentMonthStudents,
        lastMonthStudents,
        currentMonthMentors,
        lastMonthMentors,
        // for professional
        totalProfessional,
        currentMonthProfessionals,
        lastMonthProfessionals,

        todayAiRequestCount,
        yesterdayAiRequestCount

    ] = await Promise.all([
        Account_Model.countDocuments({ role: "STUDENT" }),
        Account_Model.countDocuments({ role: "MENTOR" }),
        Account_Model.countDocuments({ role: "STUDENT", createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } }),
        Account_Model.countDocuments({ role: "STUDENT", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        Account_Model.countDocuments({ role: "MENTOR", createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } }),
        Account_Model.countDocuments({ role: "MENTOR", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        // for professional
        Account_Model.countDocuments({ role: "PROFESSIONAL" }),
        Account_Model.countDocuments({ role: "PROFESSIONAL", createdAt: { $gte: currentMonthStart, $lte: currentMonthEnd } }),
        Account_Model.countDocuments({ role: "PROFESSIONAL", createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
        daily_ai_request_model.findOne({ date: today }).lean(),
        daily_ai_request_model.findOne({ date: yesterday }).lean(),
    ]);

    const calcChange = (current: number, previous: number) => {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return Math.round(((current - previous) / previous) * 100);
    };


    const studentChange = calcChange(currentMonthStudents, lastMonthStudents);
    const mentorChange = calcChange(currentMonthMentors, lastMonthMentors);
    const professionalChange = calcChange(currentMonthProfessionals, lastMonthProfessionals);

    const todayCount = todayAiRequestCount?.count ?? 0;
    const yesterdayCount = yesterdayAiRequestCount?.count ?? 0;
    const percentageChange = calcChange(todayCount, yesterdayCount);

    return {
        students: {
            title: "Total Students",
            total: totalStudents,
            change: studentChange,
            period: "from last month",
            trend: studentChange >= 0 ? "increase" : "decrease",
        },
        mentors: {
            title: "Active Mentors",
            total: totalMentors,
            change: mentorChange,
            period: "from last month",
            trend: mentorChange >= 0 ? "increase" : "decrease",
        },
        // for professional
        professionals: {
            title: "Total Professionals",
            total: totalProfessional,
            change: 0,
            period: "from last month",
            trend: professionalChange >= 0 ? "increase" : "decrease",
        },
        aiRequest: {
            title: "Daily AI Requests",
            total: todayCount,
            change: percentageChange,
            period: "from yesterday",
            trend: percentageChange >= 0 ? "increase" : "decrease",
        }

    };
};

const get_monthly_activities_from_db = async (req: Request) => {
    const month = Number(req.query.month) || new Date().getMonth() + 1; // default current month
    const year = Number(req.query.year) || new Date().getFullYear();

    const today = new Date();
    const daysInMonth = new Date(year, month, 0).getDate();

    const startDate = new Date(year, month - 1, 1); // first day of month
    // end date should be today if current month, else end of month
    const endDate =
        today.getFullYear() === year && today.getMonth() + 1 === month
            ? new Date(year, month - 1, today.getDate(), 23, 59, 59)
            : new Date(year, month, 0, 23, 59, 59);

    const getMonthlyCount = async (Model: any) => {
        return Model.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
    };

    const [flashcard, mcqbank, clinicalcase, osce, user] = await Promise.all([
        getMonthlyCount(FlashcardModel),
        getMonthlyCount(McqBankModel),
        getMonthlyCount(ClinicalCaseModel),
        getMonthlyCount(osce_model),
        getMonthlyCount(Account_Model),
    ]);

    const formatData = (data: any[]) => {
        const map: any = {};
        data.forEach(d => {
            map[d._id.day] = d.count;
        });

        // end at today if current month, else end at last day of month
        const lastDay = today.getFullYear() === year && today.getMonth() + 1 === month
            ? today.getDate()
            : daysInMonth;

        return Array.from({ length: lastDay }, (_, i) => ({
            day: i + 1,
            count: map[i + 1] || 0,
        }));
    };

    const response = Array.from({ length: formatData(flashcard).length }, (_, i) => ({
        day: i + 1,
        flashcard: formatData(flashcard)[i].count,
        mcqbank: formatData(mcqbank)[i].count,
        clinicalcase: formatData(clinicalcase)[i].count,
        osce: formatData(osce)[i].count,
        user: formatData(user)[i].count,
    }));

    return response;
};

// for student
const get_all_student_from_db_form_admin = async (req: Request) => {
    const {
        page = "1",
        limit = "10",
        search = "",
        year_of_study,
        preparingFor,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const skip = (pageNumber - 1) * pageSize;

    // Build dynamic filters for profile fields
    const profileFilters: any = {};


    if (year_of_study) {
        profileFilters["profile_id.year_of_study"] = year_of_study;
    }

    if (preparingFor) {
        profileFilters["profile_id.preparingFor"] = preparingFor;
    }

    // Build search conditions (for name/university)
    const searchConditions =
        search && (search as string).trim() !== ""
            ? {
                $or: [
                    { "profile_id.firstName": { $regex: search, $options: "i" } },
                    { "profile_id.lastName": { $regex: search, $options: "i" } },
                    { "profile_id.university": { $regex: search, $options: "i" } },
                ],
            }
            : {};

    // Aggregation pipeline
    const pipeline: any[] = [
        {
            $match: {
                role: "STUDENT",
                profile_id: { $exists: true, $ne: null }
            },
        },
        {
            $lookup: {
                from: "student_profiles", // collection name of the profile model
                localField: "profile_id",
                foreignField: "_id",
                as: "profile_id",
            },
        },
        { $unwind: "$profile_id" },
        {
            $match: {
                ...searchConditions,
                ...profileFilters,
            },
        },
        {
            $project: {
                password: 0,
            },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize },
    ];

    // Run aggregation & count total
    const [students, totalCount] = await Promise.all([
        Account_Model.aggregate(pipeline),
        Account_Model.aggregate([
            ...pipeline.slice(0, -3), // same pipeline without skip/limit
            { $count: "total" },
        ]),
    ]);

    const total = totalCount[0]?.total || 0;

    return {
        meta: {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
        data: students,
    };
};

const get_single_student_from_db_form_admin = async (id: string) => {
    const result = await Account_Model.findOne({ _id: id, role: "STUDENT" })
        .populate("profile_id")
        .select("-password")
        .lean();

    if (!result) {
        throw new AppError("Student not found", 404)
    }
    return result
}
const delete_student_from_db_form_admin = async (id: string) => {
    await Account_Model.findOneAndDelete({ _id: id, role: "STUDENT" });
    await Student_Model.findOneAndDelete({ accountId: id });
    return "Student deleted successfully"
}



// for professional

const get_all_professional_from_db_form_admin = async (req: Request) => {
    const {
        page = "1",
        limit = "10",
        search = "",
        post_graduate,
        experience,
    } = req.query;

    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const skip = (pageNumber - 1) * pageSize;

    // Build dynamic filters for profile fields
    const profileFilters: any = {};


    if (post_graduate) {
        profileFilters.post_graduate = post_graduate;
    }

    if (experience) {
        profileFilters.experience = experience;
    }


    if (search && (search as string).trim() !== "") {
        profileFilters.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { institution: { $regex: search, $options: "i" } },
        ];
    }

    const [data, total] = await Promise.all([
        ProfessionalModel
            .find(profileFilters)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }),
        ProfessionalModel.countDocuments(profileFilters),
    ]);

    return {
        meta: {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
        data: data,
    };
};

const get_single_professional_from_db_form_admin = async (id: string) => {
    const result = await Account_Model.findOne({ _id: id, role: "PROFESSIONAL" })
        .populate("profile_id")
        .select("-password")
        .lean();

    if (!result) {
        throw new AppError("Student not found", 404)
    }
    return result
}
const delete_professional_from_db_form_admin = async (id: string) => {
    await Account_Model.findOneAndDelete({ _id: id, role: "PROFESSIONAL" });
    await ProfessionalModel.findOneAndDelete({ accountId: id });
    return "Professional deleted successfully"
}


// for mentor
const get_all_mentor_from_db_form_admin = async (req: Request) => {
    const {
        searchTerm = "",
        status,
        page = "1",
        limit = "10",
    } = req.query as {
        searchTerm?: string;
        status?: string;
        page?: string;
        limit?: string;
    };
    const filters: any = {};

    // Search filter
    if (searchTerm) {
        filters.$or = [
            { firstName: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
            { specialty: { $regex: searchTerm, $options: "i" } },
            { hospitalOrInstitute: { $regex: searchTerm, $options: "i" } },
        ];
    }

    // Status filter
    if (status) {
        filters.profileVerification = status;
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await Promise.all([
        mentor_model
            .find(filters)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 }),
        mentor_model.countDocuments(filters),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
        data,
    };
};

const get_single_mentor_from_db_form_admin = async (id: string) => {
    const result = await Account_Model.findOne({ _id: id, role: "MENTOR" })
        .populate("profile_id")
        .select("-password")
        .lean();

    if (!result) {
        throw new AppError("Mentor not found", 404);
    }
    return result;
};

const delete_mentor_from_db_form_admin = async (id: string) => {
    await Account_Model.findByIdAndDelete(id);
    await mentor_model.findOneAndDelete({ accountId: id });
    return "Mentor deleted successfully";
};


// admin config

const get_all_admin_from_db = async () => {
    const result = await Account_Model
        .find({ role: "ADMIN" })
        .populate("profile_id")
        .select("-password")
        .lean();
    return result;
}

const create_new_admin_into_db = async (req: Request) => {
    const body = req?.body;
    // check if admin already exists
    const admin = await Account_Model.findOne({ email: body?.email });
    if (admin) {
        throw new AppError("Admin already exists", 400);
    }

    const session = await Account_Model.startSession();
    session.startTransaction();
    try {
        const accountRes = await Account_Model.create(
            [
                {
                    email: body?.email,
                    password: bcrypt.hashSync(body?.password as string, 10),
                    role: "ADMIN",
                    profile_type: "admin_profile",
                    isVerified: true,
                    accountStatus: "ACTIVE",
                },
            ],
            { session }
        );

        const profileRes = await Admin_Model.create(
            [
                {
                    firstName: body?.firstName,
                    lastName: body?.lastName,
                    accountId: accountRes[0]?._id,
                },
            ],
            { session }
        );
        await Account_Model.findByIdAndUpdate(
            accountRes[0]._id,
            { profile_id: profileRes[0]._id },
            { session }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
    await sendMail({
        to: body?.email,
        subject: "Welcome to Zyura-e | Admin Account Created",
        textBody: `
Welcome to Zyura-e

Hello ${body?.firstName},

Your Admin account has been successfully created.

Login Details:
Email: ${body?.email}
Temporary Password: ${body?.password}

Website: https://zyura-e.com/

For security reasons, please change your password immediately after logging in.

Best Regards,
Zyura-e Team
`,
        htmlBody: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f9; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#111827; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">Zyura-e</h1>
        <p style="color:#d1d5db; margin:5px 0 0;">Admin Account Notification</p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <h2 style="color:#111827;">Welcome, ${body?.firstName} 👋</h2>

        <p style="color:#4b5563; font-size:15px;">
          Your administrator account has been successfully created for 
          <strong>Zyura-e</strong>.
        </p>

        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
          <p style="margin:5px 0;"><strong>Email:</strong> ${body?.email}</p>
          <p style="margin:5px 0;"><strong>Temporary Password:</strong> ${body?.password}</p>
        </div>

        <p style="color:#ef4444; font-size:14px;">
          ⚠️ For security reasons, please change your password immediately after logging in.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="https://zyura-e.com/login"
             style="background:#2563eb; color:#ffffff; padding:12px 25px; 
                    text-decoration:none; border-radius:6px; font-weight:bold;">
             Login to Dashboard
          </a>
        </div>

        <p style="color:#6b7280; font-size:13px;">
          If you did not expect this email, please contact the system administrator immediately.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} Zyura-e. All rights reserved. <br/>
        https://zyura-e.com/
      </div>

    </div>
  </div>
  `,
    })
    return "Admin created successfully";
}

const delete_admin_from_db = async (req: Request) => {
    const adminId = req?.params?.adminId;
    const admin = await Account_Model.findOne({ _id: adminId, role: "ADMIN" });
    if (!admin) {
        throw new AppError("Admin not found", 404);
    }
    await Account_Model.findByIdAndDelete(adminId);
    await Admin_Model.findOneAndDelete({ accountId: admin._id });
    return "Admin deleted successfully";
}

export const admin_services = {
    get_all_overview_data_from_db_fro_admin,
    get_all_student_from_db_form_admin,
    get_single_student_from_db_form_admin,
    delete_student_from_db_form_admin,
    get_all_professional_from_db_form_admin,
    get_single_professional_from_db_form_admin,
    delete_professional_from_db_form_admin,
    get_all_mentor_from_db_form_admin,
    get_single_mentor_from_db_form_admin,
    delete_mentor_from_db_form_admin,
    get_monthly_activities_from_db,
    get_all_admin_from_db,
    create_new_admin_into_db,
    delete_admin_from_db
}