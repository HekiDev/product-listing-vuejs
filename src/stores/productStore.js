import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('productStore', () => {
    const products = ref([]);
    const categories = ref([]);

    const getProducts = async(query = '', categoryId = 0, priceMin = 0, priceMax = 100000) => {
        return await new Promise((resolve, reject) => {
            axios.get(`https://api.escuelajs.co/api/v1/products?title=${query}&price_min=${priceMin}&price_max=${priceMax}&categoryId=${categoryId}&offset=0&limit=20`)
            .then(res => {
                resolve(res.data);
                products.value = res.data;
            })
            .catch(errs => {
                reject(errs)
            })
        })
    }

    const getCategories = async() => {
        return await new Promise((resolve, reject) => {
            axios.get(`https://api.escuelajs.co/api/v1/categories`)
            .then(res => {
                resolve(res.data);
                categories.value = res.data;
            })
            .catch(errs => {
                reject(errs)
            })
        })
    }

    const createProduct = async(form) => {
        const { title, description, price, category, images } = form;
        return await new Promise((resolve, reject) => {
            axios.post(`https://api.escuelajs.co/api/v1/products/`, {
                title: title,
                description: description,
                price: price,
                categoryId: category?.id ?? 0,
                images: images.split(',').map(str => str.trim()),
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(errs => {
                reject(errs.response.data.message)
            })
        })
    }

    const getProduct = async(producId) => {
        return await new Promise((resolve, reject) => {
            axios.get(`https://api.escuelajs.co/api/v1/products/${producId}`)
            .then(res => {
                resolve(res.data);
            })
            .catch(errs => {
                reject(errs.response.data.message)
            })
        })
    }

    const updateProduct = async(productId, form) => {
        const { title, description, price, category, images } = form;
        return await new Promise((resolve, reject) => {
            axios.put(`https://api.escuelajs.co/api/v1/products/${productId}`, {
                title: title,
                description: description,
                price: price,
                categoryId: category?.id ?? 0,
                images: images.split(',').map(str => str.trim()),
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(errs => {
                reject(errs.response.data.message)
            })
        })
    }

    const deleteProduct = async(productId) => {        
        return await new Promise((resolve, reject) => {
            axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`)
            .then(res => {
                resolve(res);
            })
            .catch(errs => {
                reject(errs.response.data.message)
            })
        })
    }

    return {
        products,
        categories,
        getProducts,
        getCategories,
        createProduct,
        getProduct,
        updateProduct,
        deleteProduct,
    }
})