import product from "../Models/product.model.js";

export const getProductByID = async (req, res) => {
    try {
        const { id } = req.params;
        const foundProduct = await product.findById(id);
        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = (!category) ? {} : { category_id: category };
        const products = await product.find(filter).sort({ name: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postProducts = async (req, res) => {
    try {
        console.log(req.body);
        const { productName, image, category_id, category_name } = req.body;
        const newProduct = new product({ name: productName, image, category_id, category_name });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

