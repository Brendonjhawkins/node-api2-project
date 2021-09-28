// implement your posts router here
const express = require('express');
const posts = require('./posts-model')
const router = express.Router()

router.get('/', (req, res) => {
    posts.find(req.query)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts);
          } else {
            res.status(400).json({ message: "The posts information could not be retrieved" });
          }
        })
      .catch(error => {
        console.log(error);
        res.status(400).json({
          message: 'Error retrieving the posts',
        });
      });
  });

  router.get('/:id', (req, res) => {
    posts.findById(req.params.id)
    .then(posts => {
        if (posts) {
            res.status(200).json(posts);
          } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" });
          }
        })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: 'Error retrieving the posts',
        });
      });
  });

  router.post("/", (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
        message: "Please provide title and contents for the post",
        });
    } else {
        posts.insert(req.body)
        .then((id) => {
            res.status(201).json({
                id: id,
                title: title,
                contents: contents
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
            message: 'Error retrieving the posts',
        });
    })
  }});


  router.delete('/:id', (req, res) => {
      const deletedId = req.params.id
    posts.remove(deletedId)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ 
            deletedId
        });
        } else {
          res.status(404).json({ 
              message: "The post with the specified ID does not exist" });}
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "The post could not be removed",
        });
      });
  });
    

  router.get('/:id/comments', async (req, res) => {
    try {
      const { id } = req.params
      const comments = await posts.findPostComments(id)
      if (comments) {
        res.status(200).json(comments)
      } else {
        res.status(400).json({
            message: "The post with the specified ID does not exist"
          })
      }
      
    } catch (err) {
      res.status(500).json({
        message: err.message,
        
      })
    }
  });

  module.exports = router