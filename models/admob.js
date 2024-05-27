const mongoose = require('mongoose')
const Schema = mongoose.Schema

const admobSchema = new Schema(
    {

        admobType: [
            {
                type: String,
                enum: ['branch', 'test'],
                required: true,
                index: true,
            },
        ],
        detail: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

    },
    {
        timestamps: true,
    }
)



module.exports = admobSchema
