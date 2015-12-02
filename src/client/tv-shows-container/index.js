/**
 * Module Dependencies
 */

import $ from 'jquery'
import socketio from 'socket.io-client'

let socket = socketio()

let $tvShowsContainer = $('#app-body').find('.tv-shows')

$tvShowsContainer.on('click', 'button.like', function (ev) {
  let $this = $(this)
  let $article = $this.closest('.tv-show')
  let id = $article.data('id')

  socket.emit('vote', id)
  $article.toggleClass('liked')
})

socket.on('vote:done', vote => {
  let id = vote.showId
  let $article = $tvShowsContainer.find('article[data-id=' + id + ']')
  let counter = $article.find('.count')
  counter.html(vote.count)
})

export default $tvShowsContainer
