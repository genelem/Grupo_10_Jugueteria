const app = require("../app");
const fs = require('fs');
const path = require('path');
let db = require("../database/models");
const trademark = require("../database/models/trademark");

const productsFilePath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));





const productsControllers = {

   
'productCart': (req, res)=> {
        res.render('products/productCart');
    },


'productDetail': function(req, res) {
      let id = req.params.id
        let product = products.find(product => product.id == id)
        res.render('products/productDetail', {
            product
           
        })
      },

'formCreate': function(req, res) {
     let trademarks=db.trademark.findAll()
	let categories= db.product_category.findAll()
    
	Promise.all([trademarks,categories])
	.then(function([trademarks,categories]){

		return res.render('products/formCreate', {trademarks:trademarks,categories:categories });
	})

  },


'products': function(req, res) {
	db.product.findAll()
	   .then(function(productos){
		return res.render('products/products', {productos:productos});

	   })
    
  },

'lista': function(req, res) {
		db.product.create({
          title:req.body.titulo,
		  description:req.body.descripcionCorta,
		  price:req.body.precio,
		  image:"default.png",
		  trademark_id:req.body.marca,
		  Pcategory_id:req.body.category,

		})

		.then(()=> {
            return res.redirect('/products')})            
        .catch(error => res.send(error))
	},

  'edit': function(req, res) {
		let id = req.params.id
		let productToEdit = products.find(product => product.id == id)
		res.render('products/productsEdit', {productToEdit})
	},

	'update': function(req, res){
		let id = req.params.id;
		let productToEdit = products.find(product => product.id == id)

		productToEdit = {
			id: productToEdit.id,
			...req.body,
			imagen: 'default.png',
		};
		
		let newProducts = products.map(product => {
			if (product.id == productToEdit.id) {
				return product = {...productToEdit};
			}
			return product;
		})

		fs.writeFileSync(productsFilePath, JSON.stringify(newProducts, null, ' '));
		res.redirect('/');
	},

	eliminar : (req, res) => {
        let id = req.params.id;
        let finalProducts = products.filter(product => product.id != id);
        fs.writeFileSync(productsFilePath, JSON.stringify(finalProducts, null, ' '));
        res.redirect('/');
      },

	 

  }
  
  module.exports = productsControllers;