import PostModel from '../models/Post.js';

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            }
        ).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Can't get article.",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Article not found.',
                });
            }

            res.json(doc);
        }); //populate не работает .ошибка в получении постав после создания
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};
export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }).then((doc, err) => {
            console.log(doc);
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить статью',
                });
            }

            if (!doc) {
                return res.status(405).json({
                    message: 'Статья не найдена',
                });
            }
            res.json({
                success: true,
            });
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: 'Не удалось удалить статью',
        });
    }
};
export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            }
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
export const getLastTegs = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);
        res.json(tags);
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось получить теги',
        });
    }
};
