import express from 'express'
import tvmaze from 'tv-maze'
import Vote from 'src/server/models'

const router = express.Router()
const client = tvmaze.createClient()

// Convendria tener un archivo o modulo aparte para estas funciones de utilidad
function addVotes (shows, callback) {
  Vote.find({}, (err, votes) => {
    if (err) votes = []

    shows = shows.map(show => {
      let vote = votes.filter(vote => vote.showId === show.id)[0]
      show.count = vote ? vote.count : 0
      return show
    })

    callback(shows)
  })
}

router.get('/shows', (req, res) => {
  client.shows((err, shows) => {
    if (err) {
      return res.sendStatus(500).json(err)
    }
    addVotes(shows, shows => {
      res.json(shows)
    })
  })
})

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
