import mongoose from "mongoose"; 

export const convertToObjectId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose.Types.ObjectId(id);
}