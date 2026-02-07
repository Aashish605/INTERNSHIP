import product from "../Models/product.model.js";

export const fuzzyMatch = async (req, res) => {
    try {
        const { q } = req.query;

        // Validate search query
        if (!q || q.trim().length < 1) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters'
            });
        }

        const searchWords = q.trim().split(/\s+/);

        const regexPatterns = searchWords.map(word => ({
            name: { $regex: word, $options: 'i' }
        }));

        // Search using $or to match any of the words
        const products = await product.find({
            $or: regexPatterns
        }).limit(20);

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
}

export const fuzzyAutocomplete = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({ suggestions: [] });
        }

        // Fuzzy autocomplete - matches words that start with or contain the query
        const suggestions = await product
            .find({
                name: { $regex: q, $options: 'i' }
            })
            .limit(5)
            .select('name')
            .lean();

        res.json({
            suggestions: suggestions.map(s => s.name)
        });

    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({ suggestions: [] });
    }
}