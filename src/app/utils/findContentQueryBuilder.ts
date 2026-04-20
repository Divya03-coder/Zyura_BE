
type TGoal = {
    selectedSubjects: {
        subjectName: string;
        systemNames: string[];
    }[];
};

export const buildGoalContentFilter = (
    goal: TGoal | null,
    existingFilters: Record<string, any> = {}
) => {
    // If no goal or no subjects → return existing filters unchanged
    if (!goal || !goal.selectedSubjects?.length) {
        return existingFilters;
    }

    const goalOrConditions = goal.selectedSubjects.map((item) => {
        const condition: any = {
            subject: item.subjectName,
        };

        if (item.systemNames?.length) {
            condition.system = { $in: item.systemNames };
        }

        return condition;
    });

    return {
        ...existingFilters,
        $and: [
            ...(existingFilters.$and || []),
            { $or: goalOrConditions },
        ],
    };
};
