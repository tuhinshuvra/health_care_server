import { prisma } from "../../config/db";
import { IJWTPayload } from "../../types/common";

const insertIntoDB = async (user: IJWTPayload, payload: { scheduleIds: string[] }) => {

    // console.log("insertIntoDB : ", { user, payload });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: { email: user.email }
    });


    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctorData.id,
        scheduleId
    }))

    return await prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    })

    // return ({ user, payload });
}

export const DoctorScheduleService = {
    insertIntoDB,
}
