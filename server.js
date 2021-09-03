let express = require("express");
let morgan = require("morgan");
let ejs = require("ejs");
let mongoose = require("mongoose");
let moment = require('moment');

let Doctor = require("./model/doctor");
let Patient = require("./model/patient");
const { populate } = require("./model/doctor");

let m = moment();

let app = express();
const url = "mongodb://localhost:27017/week6lab";
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
	if(err) {
		console.log("Connection Failed");
		throw err
	}
	console.log("Connection Successful");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(morgan("tiny"));
app.use(express.static("css"));
app.use(express.static("images"));

app.get("/", (req, res) => {
	res.render("index.html");
});

app.get("/adddoctor", (req, res) => {
	res.render("adddoctor.html");
});

app.get("/addpatient", (req, res) => {
	res.render("addpatient.html");
});

app.get("/deletepatient", (req, res) => {
	res.render("deletepatient.html");
});

app.get("/updatenumberofpatients", (req, res) => {
	res.render("updatenumberofpatients.html");
});

app.get("/listdoctors", (req, res) => {
	Doctor.find({}, (err, data) => {
		res.render("listdoctors.html", {doctorList: data});
	});
});

app.get("/listpatients", (req, res) => {
	Patient.find({}).populate('doctor').exec((err, data) => {
        res.render("listpatients.html", {patientList: data});
    })
});

app.get("/listdoctors/victoria", (req, res) => {
	let filter = { 'address.state': 'VIC' };
	Doctor.find(filter, (err, data) => {
		res.render("listdoctors.html", {doctorList: data});
	});
});

app.get("/invaliddata", (req, res) => {
	res.render("invaliddata.html");
})

app.get("*", function (req, res) {
    res.render("404.html");
});

app.post("/adddoctorpost", (req, res) => {
	console.log(req.body);
	let doctor1 = new Doctor({
		_id: mongoose.Types.ObjectId(),
		fullName: {
           firstName: req.body.firstname,
           lastName: req.body.lastname
        },
		dateOfBirth: req.body.dateofbirth,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit,
        },
        numPatients: req.body.numpatients
	});

	doctor1.save((err, data) => {
		if (err){
			console.log("Failed to add doctor to the DB", err);
			res.redirect("/invaliddata")
		} else {
			console.log("Doctor data added to DB", data);
			res.redirect("/listdoctors");
		}	
	});
});

app.post("/addpatientpost", (req, res) => {
	console.log(req.body);
	let patient1 = new Patient({
		fullName: req.body.fullname,
        doctor: req.body.doctorid,
        age: req.body.age,
		dateOfVisit: req.body.dateofvisit,
        caseDescription: req.body.casedescription
	});

	patient1.save((err, data) => {
		if (err) {
			console.log("Failed to add patient to the DB", err);
			res.redirect("/invaliddata")
		} else {
			console.log("Patient data added to DB", data);
			res.redirect("/listpatients");
		}
	});
});

app.post("/deletepatientpost", (req, res) => {
	console.log(req.body);
    let filter = { fullName: req.body.fullname };
    Patient.deleteOne(filter, (err, data) => {
		if (err) throw err;
		console.log("Patient data deleted from DB successfully", data);
		res.redirect("/listpatients");
	});
}); 

app.post("/updatenumberofpatientspost", (req, res) => {
	console.log(req.body);
	let filter = { _id: req.body.doctorid };
	let theUpdate = {
		$set: {
			numPatients: req.body.numpatients
		},
	};

	Doctor.updateOne(filter, theUpdate, (err, data) => {
		if (err) throw err;
		console.log("Doctor data updated to DB successfully", data);
		res.redirect("/listdoctors");
	});
});

app.listen(8080, () => {
	console.log("Server is running at http://localhost:8080");
});