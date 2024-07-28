const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const article = require('../models/article');
const { exist } = require('mongodb/lib/gridfs/grid_store');

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/:id', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.id})
    if (article === null) res.render('/');
    res.render('articles/show', { article: article });
})

router.post('/', async (req, res) => {
    let article = new Article ({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        res.render('articles/new', { article: article } );
    }
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

router.put('/:id', async (req, res) => {
    var existingArticles = await Article.findById(req.params.id);

    existingArticles.title = req.body.title;
    existingArticles.description = req.body.description;
    existingArticles.markdown = req.body.markdown;

    await existingArticles.save(); 

    res.render('articles/show', {article: existingArticles});

})

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

module.exports = router;