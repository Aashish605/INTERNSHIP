import mongoosee from 'mongoose'

const categorySchema = new mongoosee.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const category = mongoosee.model('category', categorySchema)

export default category;