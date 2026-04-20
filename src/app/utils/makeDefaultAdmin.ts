import bcrypt from 'bcrypt';
import { configs } from "../configs";
import { Admin_Model } from "../modules/admin/admin.schema";
import { Account_Model } from "../modules/auth/auth.schema";

export const makeDefaultAdmin = async () => {
    const isAdminExist = await Account_Model.findOne({ role: "ADMIN", isDeleted: false });
    if (isAdminExist) return;

    const session = await Account_Model.startSession();
    session.startTransaction();
    try {
        const accountRes = await Account_Model.create(
            [
                {
                    email: configs.admin.email,
                    password: bcrypt.hashSync(configs.admin.password as string, 10),
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
                    firstName: "Admin",
                    lastName: "admin",
                    accountId: accountRes[0]?._id,
                    profile_photo: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
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
};
