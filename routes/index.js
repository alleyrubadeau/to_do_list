var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/toDoList')
var item = db.get('item')

/* GET home page. */
router.get('/', function(req, res, next) {
  item.find({}, function (err, docs) {
    res.render('index', { item: docs });
  })
});

router.get('/item/new', function (req, res, next) {
  res.render('new', {title: 'New Page'})
})

router.post('/', function (req, res, next) {
  if(!req.body.item) {
    res.render('new', {newError: 'You must fill in the input field'})
  }
  else {
    req.body.comments = []
    item.insert(req.body)
    res.redirect('/')
  }
})

router.post('/item/:itemId/comments/:commentId/delete', function (req, res, next) {
  item.findOne({_id: req.params.itemId}, function (err, doc) {
    var a =req.url.split('/')
    var b = a.length -2
    var idFilter = doc.comments.filter(function(comment) {
      return comment.commentId != a[b]
    })
    doc.comments = idFilter
    item.update({_id: req.params.itemId}, doc, function(err, doc) {
      res.redirect('/item/' + req.params.itemId)
    })
  })
})

router.get('/item/:id/comment/:commentId', function(req, res, next) {
  var a = req.url.split('/')
  var b = a.length -1
  item.findOne({_id: req.params.id}, function(err, doc) {
    var idFilter = doc.comments.filter(function(comment) {
      return comment.commentId == a[b]
    })
    res.render('CommentShow', {comment: idFilter[0], itemId: doc._id})
  })
})

router.get('/item/:id', function (req, res, next) {
  item.findOne({_id: req.params.id}, function(err, doc) {
    res.render('show', {item: doc})
  })
})

router.get('/item/:id/edit', function (req, res, next) {
  item.findOne({_id: req.params.id}, function (err, doc) {
    if (err) throw error;
    res.render('edit', doc)
  })
})

router.post('/item/:id/comments', function (req, res, next) {
  item.findOne({_id: req.params.id}, function (err, doc) {
    var idCount= 0
    if(doc.comments.length <1) {
      idCount = 1
      doc.comments.push({commentId: idCount, comment: req.body.comment})
    }
    else {
      var lastIndex = doc.comments.length -1
      var lastItem = doc.comments[lastIndex]
      idCount = lastItem.commentId + 1
      doc.comments.push({commentId: idCount, comment: req.body.comment})
    }
    item.update({_id: req.params.id}, doc, function (err, doc) {
      if (err) throw error
      res.redirect('/item/' + req.params.id)
    })
  })
})


router.post('/item/:id/edit', function(req, res, next) {
  item.findOne({_id: req.params.id}, function (err, doc) {
    doc.item = req.body.item
    item.update({_id: req.params.id}, doc, function (err, doc) {
      if (err) throw err
      res.redirect('/')
    })
  })
})
// router.post('/item/:id/comments', function (req, res, next) {
//   item.findOne({_id: req.params.id}, function (err, doc) {
//     var idCount= 0
//     if(doc.comments.length <1) {
//       idCount = 1
//       doc.comments.push({commentId: idCount, comment: req.body.comment})
//     }
//     else {
//       var lastIndex = doc.comments.length -1
//       var lastItem = doc.comments[lastIndex]
//       idCount = lastItem.commentId + 1
//       doc.comments.push({commentId: idCount, comment: req.body.comment})
//     }
//     item.update({_id: req.params.id}, doc, function (err, doc) {
//       if (err) throw error
//       res.redirect('/' + req.params.id)
//     })
//   })
// })





router.post('/item/:id/delete', function (req, res, next) {
  item.remove({_id: req.params.id}, function (err, doc) {
    if(err) throw err
    res.redirect('/')
  })
})



module.exports = router;
