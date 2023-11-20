// Import required packages
const express = require('express');
const mongoose = require('mongoose');

// Define connection url, ports etc
const app = express();
const uri = 'mongodb://127.0.0.1:27017/Marketplace01';
const port = 3000;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB');
  });

// Define product schema
  const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
});

const Product = mongoose.model('product', productSchema);

app.use(express.json());

// Add product
app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error posting product:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Update product
app.put('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const update = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, update, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error putting product:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Delete product by id
app.delete('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (deletedProduct) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Delete all products
app.delete('/products', async (req, res) => {
  try {
    const deleteResult = await Product.deleteMany({});
    if (deleteResult.deletedCount > 0) {
      res.json({ message: 'All products deleted' });
    } else {
      res.status(404).json({ error: 'No products found to delete' });
    }
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Find product by id
app.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product id not found' });
    }
  } catch (error) {
    console.error('Error finding product by id:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

// Search products using regex
app.get('/products/search/:searchString', async (req, res) => {
  try {
    const searchString = req.params.searchString;
    const products = await Product.find({
      $or: [
        { name: { $regex: searchString, $options: 'i' } }, 
        { category: { $regex: searchString, $options: 'i' } },
      ],
    });

    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({ error: 'No matching products found' });
    }
  } catch (error) {
    console.error('Error searching for products:', error);
    res.status(500).json({ error: 'Database Error' });
  }
});

app.get('/', (req, res) => {
  console.log('Route received');
  res.json({"message":"Welcome to Dresstore application."});
});


const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = {server,Product};