const express = require('express');
const router = express.Router();

const User = require('../models/user-model'); //La DB esta conectada siempre a través de user-model.js por eso se requiere siempre

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

/*GET NAMES*/
router.get('/names', (req, res, next) => {
	User.find()
		.then((userDoc) => {
			console.log(userDoc);
			res.render('names.hbs', {
				userDoc
			});
		})
		.catch();
});

// GET DETAILS
router.get('/details/:id', (req, res, next) => {
	console.log(req.params.id);

	User.find({
		_id: {
			$eq: req.params.id
		}
	})
		.then((userDoc) => {
			console.log(userDoc); //userDoc es un nombre arbitrario para los datos que obtenemos de la DB. Podemos llamarlo como queramos, pero en la página de la vista (details.hbs) tenemos que pasar el mism nombre.
			res.render('details.hbs', {
				userDoc
			});
		})
		.catch((err) => {
			next(err);
		});
});

// CREATE USER
router.get('/add', (req, res, next) => {
	//este solo renderiza la pagina de add
	res.render('add.hbs');
});

//creamos usuario desde el form.
//En la ruta /process-add, creada en la action del formulario
router.post('/process-add', (req, res, next) => {
	const { firstName, description } = req.body;
	console.log(firstName, description);
	//Ahora llamamos al método create de User. Es de la DB, un método de Mongo
	User.create({ firstName, description })
		.then((userDoc) => {
			console.log(userDoc);
			res.redirect('/names'); //aqui redireccionamos para que la página no se quede cargando una vez enviado el formulario
		})
		.catch((err) => next(err));
});

// UPDATE USER
router.get('/edit/:id', (req, res, next) => {
	User.find({ _id: { $eq: req.params.id } })
		.then((userDoc) => {
			res.render('edit.hbs', { userDoc });
		})
		.catch((err) => next(err));
});

router.post('/process-edit/:id', (req, res, next) => {
	const { firstName, description } = req.body;

	User.findByIdAndUpdate(req.params.id, { firstName, description }, { runValidators: true })
		.then((userDoc) => {
			console.log(userDoc);
			res.redirect('/');
		})
		.catch((err) => next(err));
});
module.exports = router;
