import Cart from '../models/Cartmodel.js';

// Add to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity, price, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], total: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price });
        }

        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get cart
export const getCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        let cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        cart.items.splice(itemIndex, 1);

        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update quantity in cart
export const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { id } = req.params;

        if (!id || !productId || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        let cart = await Cart.findOne({ userId: id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        item.quantity = quantity;

        cart.total = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error in updateQuantity:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        await Cart.findOneAndDelete({ userId: id });

        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};