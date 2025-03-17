import mongoose,{Schema,Document} from "mongoose";
export   interface iNote extends Document {
title:string,
description:string,
createdBy:string
}
const NoteSchema:Schema=new Schema({
    title:{
        type:String,
        required:true,},
        description:{
            type:String,
            required:true
        },
        createdBy:{
            type:mongoose.Types.ObjectId,
            ref:'user',
            required:true

        }

})
export default mongoose.models.Note||mongoose.model<iNote>("Note",NoteSchema);


