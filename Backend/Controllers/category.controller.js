import category from "../Models/category.model.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await category.find().sort({name:1});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postCategories = async (req, res) => {
    try {
        console.log(req.body);
        const {name} = req.body;
        const newCategory = new category({name});
        await newCategory.save();
        res.status(200).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}