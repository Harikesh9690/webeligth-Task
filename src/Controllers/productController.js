const productModel = require('../Models/productModel')

const { isValid, keyValid, priceValid, validString} = require("../validator/validations")
const { isValidObjectId } = require('mongoose')


const createProduct = async function (req, res) {
    try {
        const empId= req.params.empId;
        const decodedToken = req.decodedToken;
        const data = req.body;

        if (empId !== decodedToken.empId) return res.status(401).send({ status: false, messgage: 'You are not authorized!' })


        const { name, description,category, price,style, availableSizes } = data

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is mandatory and should have non empty String" })

        if (await productModel.findOne({ name })) return res.status(400).send({ status: false, message: `This name (${name}) is already present please Give another name` })

        if (!isValid(description)) return res.status(400).send({ status: false, message: "description is mandatory and should have non empty String" })
        if(!category) return res.status(400).send({ status: false, message: "Category is mandatory and should have non empty string"});
        
        if (!isValid(price)) return res.status(400).send({ status: false, message: "Price is mandatory and should have non empty Number" })

        if (!priceValid(price)) return res.status(400).send({ status: false, message: "price should be in  valid Formate with Numbers || Decimals" })

        if (!validString(style)) return res.status(400).send({ status: false, message: "Style should have non empty String" })

        if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes is mandatory and should have non empty String" })

        let size = availableSizes.split(',').map(x => x.trim())

        for (let i = 0; i < size.length; i++) {
            if (!(["S", "XS", "M", "X", "L", "XL", "XXL"].includes(size[i]))) return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS'  || 'M' || 'X' || 'L' || 'XXL' || 'XL']` })
        }

        let obj = {
            name, description,category, price, style, availableSizes: size
        }

        const newProduct = await productModel.create(obj)

        return res.status(201).send({ status: true, message: "Product created successfully", data: newProduct })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
//////////////////////////////////get products///////////////////////////////////////////////////////////


async function getProducts(req, res) {
    try {
        let filter = req.query;
        let query = { isDeleted: false };
        let page= req.query.page;

        if (keyValid(filter)) {
            let { category, name,priceSort,size,price } = filter;

            if(!validString(category)) return res.status(400).send({ststus:false, msg:"If you select category than it should have non empty"});
            if(category){
                query.category = category;
            }
            if (!validString(size)) { return res.status(400).send({ status: false, message: "If you select size than it should have non empty" }) }
            if (size) {
                size = size.toUpperCase()
                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size))) return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS'  || 'M' || 'X' || 'L' || 'XXL' || 'XL']` })
                query.availableSizes = size
            }

            if (!validString(name)) return res.status(400).send({ status: false, message: "If you select name than it should have non empty" })
            if (name) {
                const regexName = new RegExp(name, "i");
                query.name = { $regex: regexName };
            }

            if (!validString(price)) return res.status(400).send({ status: false, message: "If you select price than it should have non empty" })
            if (price) {
                price = JSON.parse(price)

            
                if (!priceValid(price)) { return res.status(400).send({ status: false, messsage: "Enter a valid price in priceGreaterThan" }) }
                    query.price = { '$eq': price }
            }
            if (!validString(priceSort)) return res.status(400).send({ status: false, message: "If you select priceSort than it should have non empty" })
            if (priceSort) {
                if ((priceSort == 1 || priceSort == -1)) {
                    let filterProduct = await productModel.find(query).sort({ price: priceSort })

                    if (filterProduct.length == 0) {
                        return res.status(404).send({ status: false, message: "No products found with this query" })
                    }
                    return res.status(200).send({ status: true, message: "Success", "number of products": filterProduct.length, data: filterProduct })
                }
                return res.status(400).send({ status: false, message: "priceSort must have 1 or -1 as input" })
            }
        }

        let alldata = await productModel.find(query).sort({ price: -1 })//.skip(3*(page-1)).limit(3);

        if (alldata.length == 0) {
            return res.status(404).send({ status: false, message: "No products found with this query" });
        }
     let data= await productModel.find(query).sort({ price: -1 }).skip(3*(page-1)).limit(3)

        return res.status(200).send({ status: true, message: "Success", "number of products": alldata.length, data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

///////////////////////////////////Update Product///////////////////////////////////////////////////////


const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        const empId= req.params.empId;
        const decodedToken = req.decodedToken;
        let body = req.body;

        if (empId !== decodedToken.empId) return res.status(401).send({ status: false, messgage: 'You are not authorized!' })



        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'productId is not valid' })

        let product = await productModel.findById(productId)

        if (!product) return res.status(404).send({ status: false, messgage: 'product not found' })

        if (product.isDeleted == true) return res.status(400).send({ status: false, messgage: `Product is deleted` })

        const data = {}

        let { name, description,category, price,style, availableSizes } = body

        if (!validString(name)) return res.status(400).send({ status: false, message: "name can not be empty" })
        if (name) {
            if (await productModel.findOne({ name })) return res.status(400).send({ status: false, message: `This name ${name} is already present please Give another name` })
            data.name = name;
        }

        if (!validString(description)) return res.status(400).send({ status: false, message: "description can not be empty" })
        if (description) {

            data.description = description
        }

        if (!validString(category)) return res.status(400).send({ status: false, message: "category can not be empty" })
       data.category= category;


        if (!validString(price)) return res.status(400).send({ status: false, message: "price can not be empty" })
        if (price) {

            if (!priceValid(price)) return res.status(400).send({ status: false, message: "price should be in  valid Formate with Numbers || Decimals" })

            data.price = price
        }

       
        if (!validString(style)) return res.status(400).send({ status: false, message: "style can not be empty" })
        if (style) {
            data.style = style
        }

        if (!validString(availableSizes)) return res.status(400).send({ status: false, message: "availableSizes can not be empty" })
        if (availableSizes) {
            availableSizes = availableSizes.toUpperCase()
            let size = availableSizes.split(',').map(x => x.trim())

            for (let i = 0; i < size.length; i++) {
                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size[i]))) return res.status(400).send({ status: false, message: `availableSizes should have only these Sizes ['S' || 'XS'  || 'M' || 'X' || 'L' || 'XXL' || 'XL']` })

            }
            data['$addToSet'] = {}
            data['$addToSet']['availableSizes'] = size

        }

        const newProduct = await productModel.findByIdAndUpdate(productId, data, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: newProduct })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

///////////////////////////////////delete Products//////////////////////////////////////////////////////////////////////


async function deleteProductById(req, res) {
    try {
        let productId = req.params.productId

        const empId= req.params.empId;
        const decodedToken = req.decodedToken;

        if (empId !== decodedToken.empId) return res.status(401).send({ status: false, messgage: 'You are not authorized!' })

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'productId is not valid' })
        let data = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!data) return res.status(404).send({ status: true, message: "No products found or may be deleted already" });

        await productModel.findByIdAndUpdate(productId, { isDeleted: true, deletedAt: Date() })
        return res.status(200).send({ status: true, message: "Deleted Successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createProduct , getProducts ,updateProduct, deleteProductById }