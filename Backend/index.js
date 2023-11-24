import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
    .connect(
        'mongodb+srv://stassolovyov777:777@cluster0.lfwwxxg.mongodb.net/blog?retryWrites=true&w=majority'
    )
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());
app.use(cors());
app.post(
    '/auth/login',
    loginValidation,
    handleValidationErrors,
    UserController.login
);
app.post(
    '/auth/register',
    registerValidation,
    handleValidationErrors,
    UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/tags', PostController.getLastTegs);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTegs);
app.get('/posts/:id', PostController.getOne);
app.post(
    '/posts',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.update
);

const port = process.env.Port || 4000;
app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running on port ${port}`);
});
