require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

morgan.token("body", function (req, res) { return JSON.stringify(req.body); });

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use(express.json());

app.use(cors());

app.use(express.static("dist"));

app.get("/info", (request, response) => {
	Contact.find({}).then(result => {
		response.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p>`);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Contact.findById(request.params.id).then(person => {
		if (person) {
			response.json(person);
		} else {
			response.status(404).send({ error: "No contact found with that id." });
		}
	}).catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name and number should have a value."
		});
	}

	Contact.find({ name: body.name }).then(result => {
		if (result.length > 0) {
			return response.status(400).json({
				error: "name must be unique."
			});
		} else {
			const person = new Contact({
				name: body.name,
				number: body.number,
			});

			person.save().then(savedPerson => {
				response.json(savedPerson);
			}).catch(error => next(error));
		}
	});
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Contact.findByIdAndUpdate(request.params.id, person,
		{ new: true, runValidators: true, context: "query" })
		.then(updatedPerson => {
			response.json(updatedPerson);
		}).catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Contact.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

app.get("/api/persons", (request, response) => {
	Contact.find({}).then(result => {
		response.json(result);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});