const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const baseURL = "https://pokeapi.co/api/v2/pokemon/";

const isPokemonValid = async(request, response, next) => {
    await fetch(baseURL + request.body.pokemonName).then(async(data) => {
        let dataText = await data.text();

        if (dataText == "Not Found") {
            next(new Error("Pokemon not found"));
        } else {
            request.body.pokeApiResult = JSON.parse(dataText)

            next()
        }
    })
}

const handleInvalid = (error, request, response, next) => {
    if (error){
        console.log(error.message);
        response.status(400).json({
            error: error.message
        })
    }
}


app.post('/', isPokemonValid, handleInvalid ,async (request, response) => {
    response.json({
        pokedexNumber: request.body.pokeApiResult.id,
        name: request.body.pokeApiResult.name
    });
});



app.listen(3000, () => {
    console.log("Server running!");
});
