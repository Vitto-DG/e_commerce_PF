import { Router } from 'express';
import { productModel } from '../models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.limit) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    let filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const options = {
      page,
      limit,
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : 1 };
    }

    const result = await productModule.paginate(filter, options);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const prevLink = result.hasPrevPage ?
      `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}`: ''}
      ${query ? `&query=${query}`: ''}`: null;
    const nextLink = result.hasNextPage ?
      `${baseUrl}?page=${result.NextPage}&limit=${limit}${sort ? `&sort=${sort}`: ''}
      ${query ? `&query=${query}`: ''}`: null;

    res.json({
      status:'success',
      payload: result.docs,
      totalPages: result.prevPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado.'});

    res,json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
    } = req.body;

    if (!title || !description || !code || !price || !status || !stock === undefined || !category) {
      return res.status(400).json({ status: 'error', message: 'Faltan campos obigatorios.' });
    }

    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    delete updateData._id;

    const updateProduct = await productModel.findByIdAndUpdate(pid, updateData, { new: true });
    if (!updateProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado.'});

    res.json({ status: 'success', payload: updateProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message});
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deleteProduct = await productModel.findById(pid);
    if (!deleteProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    res.json({ status: 'success', message: 'Producto eliminado correctamente', payload: deleteProduct });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
});

export default router;
