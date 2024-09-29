const mongoose = require('mongoose')
const { exec } = require('child_process');

const handleRequest = async (req, res, code) => {
    try {
        await code(req, res)
    } catch (error) {
        // Check if the status code has been set before
        if (!res.statusCode || res.statusCode === 200) {
            res.status(400);
        }
        console.log(error);
        res.json({ errorMessage: error.message, data: null })
    }
}
const handleResponse = async (res, data) => {
    return res.status(200).json(data)
}
const handleInputValidation = async (req, checks, validationResult) => {
    // Apply input validation and sanitization rules
    await Promise.all(checks.map((validation) => validation.run(req)))

    // Check for validation errors
    const errors = validationResult(req)
    let errorMessage = ''
    for (const error of errors.errors) {
        errorMessage += `${error.value} is not a valid ${error.path}, `
    }
    if (!errors.isEmpty()) {
        throw new Error(errorMessage);
    }
}

const handleMongoFilter = async (model, key, value) => {
    const Model = mongoose.model(model);

    await Model.updateMany(
        { [key]: { $in: [value] } },
        { $pull: { [key]: value } }
    )
}

const handleMongoGet = async (modelName, _id, key) => {
    const Model = mongoose.model(modelName);

    const model = await Model.findOne({ _id }, { [key]: 1 });

    if (!model) {
        throw new Error(`${model} not found in the database`);
    }
    if (!(key in model)) {
        throw new Error(`${model} does not contain ${key}`);
    }

    return model[key];
}

const handleIdentify = async (modelName, _id) => {
    const Model = mongoose.model(modelName);

    const model = await Model.findById(_id);
    if (!model) {
        throw new Error(`${modelName}: ${_id} not found in the database`);
    }

    return model;
}

const handleRandomTrack = async () => {
    const tracks = ['track1', 'track2', 'track3', 'track4', 'track5'];
    return tracks[Math.floor(Math.random() * tracks.length)];
}

const handleML = async (currentTrack, moveName, moveValue) => {
    // Placeholder for machine learning algorithm


    // exec('python3 genre_filtered.py', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         console.error(`stderr: ${stderr}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    // });


    // Return a random track for now
    return handleRandomTrack();
}

module.exports = {
    handleInputValidation,
    handleRequest,
    handleResponse,
    handleMongoFilter,
    handleMongoGet,
    handleIdentify,
    handleRandomTrack,
    handleML,
}