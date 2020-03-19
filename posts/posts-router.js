const express = require('express');
const Posts = require('../data/db');

const router = express.Router();


router.post('/', (req, res) => {
    
    const body = req.body;
    
    Posts.insert(body)
        .then(add => {
            if (add) {
                res.status(201).json(add); // changed from body to add
            }
        })
        .catch(err => {
            if (!body.title || !body.contents) {
                res.status(400).json({ success: false, errorMessage: "Please provide title and contents for the post." });  
            }
            else {
            res.status(500).json({ success: false, errorMessage: "There was an error while saving the post to the database" });
            }
        });
});

router.post('/:id/comments', (req, res) => {

    const addBody = req.body;
    const { id } = req.params;
    addBody.post_id = id;

    Posts.insertComment(addBody)
        .then(add => {
            if (add) {
                console.log('this is body for post comments', addBody);
                console.log('this is add for post comments', add);
                res.status(201).json(add); // changed from "addBody" to "add" to get { ID }
            }
            else {
                res.status(404).json({ message: "The post with the specified id does not exist" });
            } // ***cannot catch 404 error***
        })
        .catch(err => {
            if (!addBody.text) {
                res.status(400).json({ errorMessage: "Please provide text for the comment" });
            }
            else {
                res.status(500).json({ error: "There was an error while saving the comment to the database"});
            }
        })
});

router.get('/', (req, res) => {
    
    Posts.find()
        .then(retrieve => {
            res.status(200).json(retrieve)
        })
        .catch(err => res.status(500).json({ error: "The posts information could not be retrieved" }));
});

router.get('/:id', (req, res) => {
    
    const { id } = req.params;

    Posts.findById(id)
        .then(retrieve => {
            if (retrieve) {
                res.status(200).json(retrieve);
            }
            else {
                res.status(404).json({ message: "The post with the specified id does not exist" });
            }
        })
        .catch(err => res.status(500).json({ error: "The post information could not be retrieved" }));
});

router.get('/:id/comments', (req, res) => {

    const { id } = req.params;

    Posts.findPostComments(id)
        .then(retrieve => {
            if (retrieve.length > 0) {
                console.log('this is id from get comments by id', id);
                console.log('this is retrieve from get comments by id', retrieve);
                res.status(200).json(retrieve);
            }
            else {
                res.status(404).json({ message: "The specified ID does not exist" });
            } 
        })
        .catch(err => res.status(500).json({ error: "The comments information could not be retrieved" }));
});

router.delete('/:id', (req, res) => {
    
    const { id } = req.params;

    Posts.findById(id)
       .then(retrieve => {
          retrieve 
            ?  Posts.remove(id)
                   .then(deleted => {
                      if (deleted) {
                         res.status(200).json(retrieve)
                      } 
                   })
                   .catch(err => res.status(500).json({ error: 'The post could not be removed' }))
            
            :  res.status(404).json({ message: 'The post with the specified ID does not exist.' })
       })
       .catch(err => res.status(500).json({ error: 'The post information could not be retrieved.' }))
});

router.put('/:id', (req, res) => {

    const { id } = req.params;
    const newInfo = req.body;

    Posts.update(id, newInfo)
        .then(updated => {
            if (updated > 0) {
                console.log('this is updated from put to an id', updated);
                console.log('this is newInfo from put to an id', newInfo);
                console.log('this is id from put to an id', id);
                res.status(200).json(newInfo);
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(err => {
            if (!newInfo.title || !newInfo.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post" });
            } 
            else { 
                res.status(500).json({ error: "The post information could not be modified" });
            }
        });
});

module.exports = router;
