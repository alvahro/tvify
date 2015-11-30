import express from 'express'
import Vote from 'src/server/models'

const router = express.Router()

// GET /api/votes
router.get('/votes', (req, res) => {
  Vote.find({}, (err, docs) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }
    res.json(docs)
  })
})

// POST /api/vote/123
router.post('/vote/:id', (req, res) => {
  let onSave = function (vote) {
    return function (err) {
      if (err) {
        return res.sendStatus(500).json(err)
      }
      res.json(vote)
    }
  }

  let id = req.params.id

  Vote.findOne({ showId: id }, (err, doc) => {
    if (!err && doc) {
      // actualizo este doc
      doc.count = doc.count + 1
      doc.save(onSave(doc))
    } else {
      // creo un doc nuevo y le pongo count 1
      let vote = new Vote()
      vote.showId = id
      vote.count = 1
      vote.save(onSave(vote))
    }
  })
})

export default router
