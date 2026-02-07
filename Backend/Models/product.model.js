import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    category_name: {
        type: String,
        required: true
    }
});

productSchema.index({
    name: 'text',
    category_name: 'text'
}, {
    weights: {
        name: 10,           
        category_name: 5    
    }
});

const product = mongoose.model('product', productSchema)

export default product;