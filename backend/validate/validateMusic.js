import Joi from 'joi';

const userValidation = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    artistName: Joi.string().min(3).max(50).required(),
    duration: Joi.string().min(3).max(7).required(), 
});
const validate= (req, res, next)=>{
    const object= {
        title: req.body.title,
        artistName: req.body.artistName,
        duration: req.body.duration,
    }
    const { error } = userValidation.validate(object);
    if (error) {
        next(error.details[0]);
    } else {
        next();
    }
}

export default validate;